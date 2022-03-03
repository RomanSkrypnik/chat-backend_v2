const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const {messageStorage} = require('../utils/multer.utils');
const upload = multer({storage: messageStorage});

router.post('/messages', AuthMiddleware, messageController.messages);
router.post('/send-media-message', AuthMiddleware, upload.any('files'), messageController.sendMediaMessage);
router.post('/read-message', AuthMiddleware, messageController.readMessage);

module.exports = router;
