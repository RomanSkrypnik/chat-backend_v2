const router = require('express').Router();

const blockedController = require('../controllers/blocked.controller');

const AuthMiddleware = require('../middlewares/auth.middleware');

router.post('/block-user', AuthMiddleware, blockedController.block);
router.post('/unblock-user', AuthMiddleware, blockedController.unblock);

module.exports = router;
