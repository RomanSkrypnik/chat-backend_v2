const router = require('express').Router();

const authController = require('../controllers/auth.controller');

const AuthMiddleware = require('../middlewares/auth.middleware');

const {body} = require('express-validator');

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    authController.register);
router.post('/login', authController.login);
router.post('/logout', AuthMiddleware, authController.logout);
router.get('/activate/:link', authController.activate);
router.get('/refresh', authController.refresh);
router.post('/check-password-identity', AuthMiddleware, authController.checkPasswordIdentity);


module.exports = router;
