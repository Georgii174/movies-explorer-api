const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  JWT_SECRET: 'super_secret-key',
  ...process.env,
};
