const router = require('express').Router();

const mutedController = require('../controllers/muted.controller');

const AuthMiddleware = require('../middlewares/auth.middleware');

router.post('/mute-relation', AuthMiddleware, mutedController.mute);
router.post('/unmute-relation', AuthMiddleware, mutedController.unmute);

module.exports = router;
