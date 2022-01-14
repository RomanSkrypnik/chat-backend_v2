const friendService = require('../services/friend.service');

class FriendController {

    async friends(req, res, next) {
        try {
            const {email} = req.body;
            const friends = await friendService.getFriends(email);
            return res.send(friends);
        } catch (e) {
            next(e);
        }
    }

    removeFriend(req, res, next) {
        try {

        } catch(e) {
            next(e);
        }
    }


}

module.exports = new FriendController();