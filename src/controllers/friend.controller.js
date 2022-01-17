const friendService = require('../services/friend.service');

class FriendController {

    async friends(req, res, next) {
        try {
            const friends = await friendService.getFriends(req.user);
            return res.send(friends);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async searchFriends(req, res, next) {
        try {
            const {search} = req.body;
            const friends = await friendService.getFriendsBySearch(req.user, search);
            return res.json(friends);
        } catch (e) {
            next(e);
        }
    }

    async removeFriend(req, res, next) {
        try {
            const {hash} = req.body;
            const user = await friendService.removeFriend(req.user, hash);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new FriendController();
