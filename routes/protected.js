const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/token');

// Middleware para verificar se o usuário está logado
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Página inicial (área do usuário)
router.get('/', isAuthenticated, (req, res) => {
  // Geração dos tokens para cada serviço
  const tokenConcursos = generateToken(req.session.userId, 'concursos');
  const tokenApostilas = generateToken(req.session.userId, 'apostilas');
  res.render('index', { 
    nome: req.session.userNome,
    tokenConcursos,
    tokenApostilas
  });
});

// Rota para o Assistente para Concursos
router.get('/assistente_concursos', isAuthenticated, (req, res) => {
  const tokenEsperado = generateToken(req.session.userId, 'concursos');
  if (!req.query.token || req.query.token !== tokenEsperado) {
    return res.send('Acesso não autorizado.');
  }
  res.redirect('https://chatgpt.com/g/g-67db206bbda8819197bebe57f0201269-assistente-para-concurso-de-oficial-de-cartorio-sps');
});

// Rota para o Resumidor de Apostilas
router.get('/resumidor_apostilas', isAuthenticated, (req, res) => {
  const tokenEsperado = generateToken(req.session.userId, 'apostilas');
  if (!req.query.token || req.query.token !== tokenEsperado) {
    return res.send('Acesso não autorizado.');
  }
  res.redirect('https://chatgpt.com/g/g-67e4600f0c588191a58ae94d5815fec0-resumidor-de-apostilas');
});

// Importa seu pool e a query de criação
const pool = require('../config/db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL
);
`;

// Rota protegida para inicializar o banco
router.get('/init-db', isAuthenticated, async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    res.send("Tabela 'usuarios' criada com sucesso (ou já existia).");
  } catch (err) {
    console.error("Erro ao criar a tabela:", err);
    res.status(500).send("Erro ao criar a tabela.");
  }
});


module.exports = router;
