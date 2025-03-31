const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'jota',       // Substitua pelo seu usuário
  password: '293121',   // Substitua pela sua senha
  database: 'meu_site_db',   // Nome do banco de dados
  port: 5432,
});

module.exports = pool;
