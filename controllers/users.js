const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Conflicted = require('../errors/conflicted');
const NotFound = require('../errors/NotFoundError');
const BadRequest = require('../errors/badReques');
const { JWT_SECRET_DEV } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const { CREATED_CODE } = require('../errors/statusCode');

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(CREATED_CODE).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((evt) => {
      if (evt.code === 11000) {
        next(new Conflicted('Такой пользователь уже существует'));
      } else if (evt.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else {
        next(evt);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((evt) => {
      if (evt.name === 'CastError') {
        next(new BadRequest('Запрашиваемый пользователь не найден'));
      } else {
        next(evt);
      }
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((evt) => {
      if (evt.code === 11000) {
        next(new Conflicted('Такой пользователь уже существует'));
      } else if (evt.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(evt);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser, getCurrentUser, updateUser, login,
};
