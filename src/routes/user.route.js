const router = require('express').Router();
const multer = require('multer');

const userController = require('../controllers/user.controller');

const AuthMiddleware = require('../middlewares/auth.middleware');

const {avatarStorage} = require('../utils/multer.utils');

const upload = multer({storage: avatarStorage});

router.post('/users-by-search', AuthMiddleware, userController.usersBySearch);
router.post('/upload-photo', AuthMiddleware, upload.single('avatar'), userController.uploadPhoto);
router.post('/change-personal-info', AuthMiddleware, userController.changePersonalInfo);

module.exports = router;
