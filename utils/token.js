const crypto = require('crypto');

function generateToken(userId, service) {
  // Chaves secretas para cada serviço
  const secrets = {
    concursos: 'concursos_chave_secreta',
    apostilas: 'apostilas_chave_secreta'
  };

  const secret = secrets[service];
  if (!secret) {
    throw new Error('Serviço inválido para geração de token.');
  }
  return crypto.createHash('md5').update(userId + secret).digest('hex');
}

module.exports = { generateToken };
