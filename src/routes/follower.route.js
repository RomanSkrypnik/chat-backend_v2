const router = require('express').Router();
const followerController = require('../controllers/follower.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.get('/followings', AuthMiddleware, followerController.followings);
router.get('/followers', AuthMiddleware, followerController.followers);
router.post('/follow', AuthMiddleware, followerController.follow);
router.post('/unfollow', AuthMiddleware, followerController.unfollow);
router.post('/add-follower', AuthMiddleware, followerController.addFollower);

module.exports = router;
