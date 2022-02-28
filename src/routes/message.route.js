const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.post('/messages', AuthMiddleware, messageController.messages);
router.post('/send-message', AuthMiddleware, messageController.sendMessage);
router.post('/read-message', AuthMiddleware, messageController.readMessage);

module.exports = router;
