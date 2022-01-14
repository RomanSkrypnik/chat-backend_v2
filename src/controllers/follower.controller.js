const followerService = require('../services/follower.service');

class FollowerController {

    async followings(req, res, next) {
        try {
            const {email} = req.body;
            const followings = await followerService.getFollowings(email);
            return res.json(followings);
        } catch (e) {
            next(e);
        }
    }

    async followers(req, res, next) {
        try {
            const {email} = req.body;
            const followers = await followerService.getFollowers(email);
            return res.json(followers);
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    async follow(req, res, next) {
        try {
            const {sender, receiver} = req.body;
            const following = await followerService.createFollow(sender, receiver);
            return res.json(following);
        } catch (e) {
            next(e);
        }
    }

    async unfollow(req, res, next) {
        try {
            const {sender, receiver} = req.body;
            const following = await followerService.removeFollow(sender, receiver);
            return res.json(following);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async addFollower(req, res, next) {
        try {
            const {sender, receiver} = req.body;
            const friend = await followerService.addFollower(sender, receiver);
            return res.json(friend);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new FollowerController();