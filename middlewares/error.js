const INTERNAL_SERVER_ERROR = require('../errors/statusCode');

const errorMiddleware = (error, req, res, next) => {
  if (error.statusCode) {
    res.status(error.statusCode).send({ message: error.messages });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
  }
  next();
};

module.exports = { errorMiddleware };
