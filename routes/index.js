const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { loginValidator, createUserValidator } = require('../middlewares/validation');
const NotFound = require('../errors/NotFoundError');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use(authMiddleware);

router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
