const router = require('express').Router();

const {
  getUser, updateUser,
} = require('../controllers/users');

const { validateRouterUpdateUser } = require('../middlewares/validations');

router.get('/users/me', getUser);

router.patch('/users/me', validateRouterUpdateUser, updateUser);

module.exports = router;
