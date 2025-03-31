// utils/encryption.js
const crypto = require('crypto');

// Algoritmo simétrico e configuração – em produção, use variáveis de ambiente
const algorithm = 'aes-256-cbc';
// Gera uma chave a partir de uma senha e salt; o ideal é manter a chave em ambiente seguro
const key = crypto.scryptSync('minha_senha_super_secreta', 'salt', 32);
const iv = Buffer.alloc(16, 0); // Vetor de inicialização (neste exemplo, fixo; em produção, pode ser aleatório e enviado junto)

function encryptURL(url) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(url, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptURL(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encryptURL, decryptURL };
