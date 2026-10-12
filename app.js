
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app', 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'app', 'public')));

const contatoRoutes = require('./app/routes/router');
app.use('/', contatoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    
    console.log('Servidor iniciado com sucesso!');
    console.log(`Acesse: http://localhost:${PORT}`);
});
