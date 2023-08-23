const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
// const { PORT = 3003 } = process.env;
const { PORT = 3000 } = process.env;
const { cors } = require('./middlewares/cors');
const { errorMiddleware } = require('./middlewares/error');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
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

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Запуск сервера');
});
