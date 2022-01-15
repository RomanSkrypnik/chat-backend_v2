const router = require('express').Router();
const statusController = require('../controllers/status.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.get('/statuses', statusController.statuses);
router.post('/change-status', AuthMiddleware, statusController.changeStatus);

module.exports = router;
