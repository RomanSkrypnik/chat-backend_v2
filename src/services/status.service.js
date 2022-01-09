const StatusModel = require('../db/connection').statuses;

class StatusController {

    async getAllStatuses() {
        return StatusModel.findAll();
    }

}

module.exports = new StatusController();
