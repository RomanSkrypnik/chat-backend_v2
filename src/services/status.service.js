const StatusModel = require('../db/connection').statuses;
const StatusDto = require('../dtos/status.dto');

class StatusController {

    async getAllStatuses() {
        const statuses = await StatusModel.findAll();
        return statuses.map(status => new StatusDto(status));
    }

}

module.exports = new StatusController();
