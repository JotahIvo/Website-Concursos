const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Configuração da sessão
app.use(session({
  secret: 'sua_senha_super_secreta', // altere para um valor complexo
  resave: false,
  saveUninitialized: false
}));

// Configura o EJS como engine de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para tratar dados de formulários
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (CSS, JS, etc)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

app.use('/', authRoutes);
app.use('/', protectedRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
