require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHA
    }
});

// Configuração do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'app', 'public')));

// Rotas
const contatoRoutes = require('./app/routes/router');
app.use('/', contatoRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log('Servidor iniciado com sucesso!');
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log('Email configurado:', Boolean(process.env.EMAIL));
    console.log('Senha configurada:', Boolean(process.env.SENHA));
});