const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,       // Ex: ec2-xx-xx-xx-xx.compute-1.amazonaws.com
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // Necessário para conexões seguras, especialmente no Heroku
});

module.exports = pool;
