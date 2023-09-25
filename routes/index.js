const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { loginValidator, createUserValidator } = require('../middlewares/validation');
const NotFound = require('../errors/NotFoundError');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

// router.use(auth);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
