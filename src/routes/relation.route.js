const router = require('express').Router();
const relationController = require('../controllers/relation.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.get('/friends', AuthMiddleware, relationController.friends);
router.post('/search-friend-by-hash', AuthMiddleware, relationController.searchFriendByHash);
router.post('/remove-friend', AuthMiddleware, relationController.removeFriend);

module.exports = router;
