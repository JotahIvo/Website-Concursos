const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Exibe o formulário de login
router.get('/login', (req, res) => {
  res.render('login', { erro: null });
});

// Processa o login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const usuario = result.rows[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (senhaValida) {
        // Cria a sessão
        req.session.userId = usuario.id;
        req.session.userNome = usuario.nome;
        return res.redirect('/');
      }
    }
    res.render('login', { erro: 'Email ou senha incorretos.' });
  } catch (error) {
    console.error(error);
    res.render('login', { erro: 'Ocorreu um erro.' });
  }
});

// Rota para logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Exibe o formulário de registro
router.get('/register', (req, res) => {
  res.render('register', { erro: null });
});

// Processa o registro do usuário
router.post('/register', async (req, res) => {
  const { email, nome, senha } = req.body;
  try {
    // Verifica se o email já está cadastrado
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.render('register', { erro: 'Email já cadastrado.' });
    }
    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    // Insere o novo usuário na tabela
    await pool.query('INSERT INTO usuarios (email, nome, senha) VALUES ($1, $2, $3)', [email, nome, hashedPassword]);
    // Redireciona para a página de login após o registro
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { erro: 'Erro ao registrar usuário.' });
  }
});

module.exports = router;
