const { Pool } = require('pg');

// Configure a conexão com os dados do seu PostgreSQL
const pool = new Pool({
  host: 'localhost',
  user: 'jota',       // Substitua pelo seu usuário do PostgreSQL
  password: '293121',   // Substitua pela sua senha
  database: 'meu_site_db',   // Nome do banco de dados
  port: 5432,
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL
);
`;

async function initDB() {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL com sucesso!");
    
    // Cria a tabela de usuários, se não existir
    await client.query(createTableQuery);
    console.log("Tabela 'usuarios' criada com sucesso (ou já existe).");
    
    client.release();
    pool.end();
  } catch (err) {
    console.error("Erro ao criar a tabela:", err);
    process.exit(1);
  }
}

initDB();
