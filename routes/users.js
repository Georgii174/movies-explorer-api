const router = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const { getCurrentUserValidator, updateUserValidator } = require('../middlewares/validation');

router.get('/me', getCurrentUserValidator, getCurrentUser);
router.patch('/me', updateUserValidator, updateUser);

module.exports = router;
