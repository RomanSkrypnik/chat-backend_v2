const router = require('express').Router();
const friendController = require('../controllers/friend.controller');

router.get('/friends', friendController.friends);
router.post('/remove-friend', friendController.removeFriend);

module.exports = router;