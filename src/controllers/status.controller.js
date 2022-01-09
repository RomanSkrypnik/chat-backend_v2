const statusService = require('../services/status.service');

class StatusController {

    async statuses(req, res, next) {
        try {
            const statuses = await statusService.getAllStatuses();
            return res.send(statuses);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

}

module.exports = new StatusController();
