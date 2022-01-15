const StatusModel = require('../db/connection').statuses;
const UserService = require('../services/user.service');
const ApiException = require('../exceptions/api.exception');
const StatusDto = require('../dtos/status.dto');

class StatusController {

    async getAllStatuses() {
        const statuses = await StatusModel.findAll();
        return statuses.map(status => new StatusDto(status));
    }

    async changeUserStatus(user, status) {
        const foundStatus = await StatusModel.findOne({where: {value: status.value}});

        if (!foundStatus) {
            ApiException.BadRequest('Status is not found');
        }

       await user.update({statusId: foundStatus.id});
    }

}

module.exports = new StatusController();
