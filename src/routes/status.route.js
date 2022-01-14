const router = require('express').Router();
const statusController = require('../controllers/status.controller');

router.get('/statuses', statusController.statuses);
router.post('/change-status', statusController.changeStatus);

module.exports = router;
