const relationService = require('../services/relation.service');

class RelationController {

    async friends(req, res, next) {
        try {
            const friends = await relationService.getFriendsWithMessages(req.user);
            return res.json(friends);
        } catch (e) {
            next(e);
        }
    }

    async searchFriendByHash(req, res, next) {
        try {
            const {hash} = req.body;

            const user = await relationService.getFriendWithMessages(req.user, hash);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async removeFriend(req, res, next) {
        try {
            const {hash} = req.body;

            const user = await relationService.removeFriend(req.user, hash);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new RelationController();
