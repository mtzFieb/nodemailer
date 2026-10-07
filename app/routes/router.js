const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

// 1. Rota para exibir o formulário de contato
router.get("/", (req, res) => {
    res.render("pages/index", { errors: [], valores: {} });
});

// 2. Rota POST para receber os dados e enviar o e-mail
router.post("/enviar", 
    [
        // Validações exigidas pelo express-validator
        body("nome").notEmpty().withMessage("O nome é obrigatório"),
        body("email").isEmail().withMessage("Insira um e-mail válido"),
        body("telefone").notEmpty().withMessage("O telefone é obrigatório"),
        body("assunto").notEmpty().withMessage("O assunto é obrigatório"),
        body("mensagem").isLength({ min: 10 }).withMessage("A mensagem deve ter pelo menos 10 caracteres")
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        
        // Se houver erros de validação, recarrega a página mostrando os erros
        if (!errors.isEmpty()) {
            return res.render("pages/index", { 
                errors: errors.array(), 
                valores: req.body 
            });
        }

        // Recupera os dados enviados pelo formulário HTML
        const { nome, email, telefone, assunto, mensagem } = req.body;

        // Configuração do Nodemailer utilizando variáveis do .env (requisito do exercício)
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        try {
            // Envia o e-mail para você mesmo com as informações recebidas
            await transporter.sendMail({
                from: `"${nome}" <${email}>`, // Quem enviou no formulário
                to: process.env.EMAIL_USER,    // Para você mesmo (seu e-mail de teste)
                subject: `Contato Form: ${assunto}`,
                html: `
                    <h2>Nova mensagem de contato</h2>
                    <p><strong>Nome:</strong> ${nome}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Telefone:</strong> ${telefone}</p>
                    <p><strong>Assunto:</strong> ${assunto}</p>
                    <p><strong>Mensagem:</strong><br>${mensagem}</p>
                `
            });

            // Redireciona ou envia uma mensagem de sucesso
            res.send("E-mail enviado com sucesso utilizando o Nodemailer!");

        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao tentar enviar o e-mail.");
        }
    }
);

module.exports = router;
