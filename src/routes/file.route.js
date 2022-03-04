const router = require('express').Router();
const fileController = require('../controllers/file.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.post('/delete-media-file', AuthMiddleware, fileController.deleteMediaFiles);

module.exports = router;
