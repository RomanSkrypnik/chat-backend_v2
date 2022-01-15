const router = require('express').Router();
const friendController = require('../controllers/friend.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.get('/friends', AuthMiddleware, friendController.friends);
router.post('/search-friends', AuthMiddleware, friendController.searchFriends);
router.post('/remove-friend', AuthMiddleware, friendController.removeFriend);

module.exports = router;
