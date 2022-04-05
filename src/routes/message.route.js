const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const {messageStorage, voiceStorage} = require('../utils/multer.utils');

const fileUpload = multer({storage: messageStorage});
const voiceUpload = multer({storage: voiceStorage,});

router.post('/messages', AuthMiddleware, messageController.messages);
router.post('/update-text-message', AuthMiddleware, messageController.updateMessage);
router.post('/send-text-message', AuthMiddleware, messageController.sendTextMessage);
router.post('/send-media-message', AuthMiddleware, fileUpload.array('media'), messageController.sendMessageWithMedia);
router.post('/send-voice-message', AuthMiddleware, voiceUpload.single('voice'), messageController.sendVoiceMessage);
router.post('/read-message', AuthMiddleware, messageController.readMessage);
router.post('/stare-message', AuthMiddleware, messageController.stareMessage);
router.post('/clear-chat', AuthMiddleware, messageController.clearMessages);

module.exports = router;
