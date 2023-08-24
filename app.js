require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
// const { PORT = 3003 } = process.env;
const { PORT = 3000 } = process.env;
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/error');
const helmet = require('helmet');
const limit = require('./middlewares/rateLimiter');
const { MONGO_URL_DEV } = require('./utils/constants');

const { NODE_ENV, MONGO_URL } = process.env;

const app = express();

// mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb')
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV)
  .then(() => {
    console.log('Connected!');
  })
  .catch((error) => {
    console.log('No Connected!', error);
  });

app.use(express.json());
app.use(cors);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(helmet());

app.use(limit);

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Запуск сервера');
});
