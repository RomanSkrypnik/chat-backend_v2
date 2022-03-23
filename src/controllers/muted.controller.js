const mutedService = require('../services/muted.service');

class MutedController {

    async mute(req, res, next) {
        try {
            const {hash} = req.body;

            const friend = await mutedService.muteRelation(req.user, hash);

            return res.json(friend);
        } catch (e) {
            next(e);
        }
    }

    async unmute(req, res, next) {
        try {
            const {hash} = req.body;

            const friend = await mutedService.unmuteRelation(req.user, hash);

            return res.json(friend);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new MutedController();
