const blockedService = require('../services/blocked.service');

class BlockedController {

    async block(req, res, next) {
        try {
            const {hash} = req.body;

            const user = await blockedService.blockUser(req.user, hash);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async unblock(req, res, next) {
        try {
            const {hash} = req.body;

            const user = await blockedService.unblockUser(req.user, hash);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new BlockedController();
