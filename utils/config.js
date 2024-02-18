const MONGO_DB_URL = 'mongodb://localhost:27017/bitfilmsdb';
const JWT_SECRET_KEY = 'dev-secret-key';
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standartHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  MONGO_DB_URL,
  JWT_SECRET_KEY,
  limiter,
};
