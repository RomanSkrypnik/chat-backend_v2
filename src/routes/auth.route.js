const router = require('express').Router();
const userController = require('../controllers/user.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// == POST routes ==
router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);


// == GET routes ==
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', AuthMiddleware, userController.users);


module.exports = router;
