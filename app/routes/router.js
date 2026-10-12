
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');


router.get('/', (req, res) => {
    res.render('pages/index', {
        erros: [],
        dados: {},
        sucesso: ''
    });
});

router.post(
    '/enviar',
    [
        body('nome')
            .trim()
            .notEmpty().withMessage('Informe seu nome.'),

        body('email')
            .trim()
            .isEmail().withMessage('Informe um e-mail válido.'),

        body('telefone')
            .trim()
            .notEmpty().withMessage('Informe seu telefone.'),

        body('assunto')
            .trim()
            .notEmpty().withMessage('Informe o assunto.'),

        body('mensagem')
            .trim()
            .notEmpty().withMessage('Digite sua mensagem.')
    ],
    async (req, res) => {
        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            return res.status(400).render('pages/index', {
                erros: erros.array(),
                dados: req.body,
                sucesso: ''
            });
        }

        const { nome, email, telefone, assunto, mensagem } = req.body;

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: `"Formulário de contato" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                replyTo: email,
                subject: `Contato: ${assunto}`,
                text: `
Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}
Assunto: ${assunto}

Mensagem:
${mensagem}
                `
            });

            return res.status(200).render('pages/index', {
                erros: [],
                dados: {},
                sucesso: 'Mensagem enviada com sucesso!'
            });
            
       
} catch (erro) {
    console.error('Erro ao enviar e-mail:', erro);

    return res.status(500).render('pages/index', {
        erros: [{
            msg: 'Falha ao enviar e-mail. Confira o terminal do VS Code.'
        }],
        dados: req.body,
        sucesso: ''
    });
}

    }
);

module.exports = router;
