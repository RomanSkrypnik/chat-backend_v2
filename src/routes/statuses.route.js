const router = require('express').Router();
const statusController = require('../controllers/status.controller');

router.get('/statuses', statusController.statuses);

module.exports = router;
