const relationService = require("../services/relation.service");

const userFacade = require('../facades/user.facade');

class RelationController {

    async friends(req, res, next) {
        try {
            const friends = await userFacade.getUsersWithMessages(req.user);
            return res.json(friends);
        } catch (e) {
            next(e);
        }
    }

    async searchFriendByHash(req, res, next) {
        try {
            const {hash} = req.body;

            const user = await userFacade.getUserWithMessages(req.user, hash);

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
