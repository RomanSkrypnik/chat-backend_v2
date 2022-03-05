const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const {messageStorage} = require('../utils/multer.utils');
const upload = multer({storage: messageStorage});

router.post('/messages', AuthMiddleware, messageController.messages);
router.post('/send-message', AuthMiddleware, upload.array('media'), messageController.sendMessage);
router.post('/read-message', AuthMiddleware, messageController.readMessage);

module.exports = router;
