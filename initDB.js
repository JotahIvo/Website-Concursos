const { Pool } = require('pg');

// Configure a conexão com os dados do seu PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,       // Ex: ec2-xx-xx-xx-xx.compute-1.amazonaws.com
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // Necessário para conexões seguras, especialmente no Heroku
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
