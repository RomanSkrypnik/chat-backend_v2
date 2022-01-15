const followerService = require('../services/follower.service');

class FollowerController {

    async followings(req, res, next) {
        try {
            const followings = await followerService.getFollowings(req.user);
            return res.json(followings);
        } catch (e) {
            next(e);
        }
    }

    async followers(req, res, next) {
        try {
            const followers = await followerService.getFollowers(req.user);
            return res.json(followers);
        } catch(e) {
            next(e);
        }
    }

    async follow(req, res, next) {
        try {
            const {hash} = req.body;
            const following = await followerService.createFollow(req.user, hash);
            return res.json(following);
        } catch (e) {
            next(e);
        }
    }

    async unfollow(req, res, next) {
        try {
            const {hash} = req.body;
            const following = await followerService.removeFollow(req.user, hash);
            return res.json(following);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async addFollower(req, res, next) {
        try {
            const {hash} = req.body;
            const friend = await followerService.addFollower(req.user, hash);
            return res.json(friend);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new FollowerController();
