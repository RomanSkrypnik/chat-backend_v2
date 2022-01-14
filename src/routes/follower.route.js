const router = require('express').Router();
const followerController = require('../controllers/follower.controller');

router.get('/followings', followerController.followings);
router.get('/followers', followerController.followers);
router.post('/follow', followerController.follow);
router.post('/unfollow', followerController.unfollow);
router.post('/add-follower', followerController.addFollower);

module.exports = router;