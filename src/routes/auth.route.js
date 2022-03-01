const router = require('express').Router();
const userController = require('../controllers/user.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const multer = require('multer');
const {avatarStorage} = require('../utils/multer.utils');
const upload = multer({storage: avatarStorage});

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.register);
router.post('/login', userController.login);
router.post('/logout', AuthMiddleware, userController.logout);
router.post('/users-by-search', AuthMiddleware, userController.usersBySearch);
router.post('/upload-photo', AuthMiddleware, upload.single('avatar'), userController.uploadPhoto);
router.post('/check-password-identity', AuthMiddleware, userController.checkPasswordIdentity);
router.post('/change-personal-info', AuthMiddleware, userController.changePersonalInfo);


router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', AuthMiddleware, userController.users);


module.exports = router;
