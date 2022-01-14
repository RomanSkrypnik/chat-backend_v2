const statusService = require('../services/status.service');

class StatusController {

    async statuses(req, res, next) {
        try {
            const statuses = await statusService.getAllStatuses();
            return res.json(statuses);
        } catch (e) {
            next(e);
        }
    }

    async changeStatus(req, res, next) {
        try {
           const { email, status } = req.body;
           await statusService.changeUserStatus(email, status);
           return res.json({message: 'Status is changed'});
        } catch(e) {
            next(e);
        }
    }

}

module.exports = new StatusController();
