const StatusModel = require('../db/connection').statuses;
const UserModel = require('../db/connection').users;
const ApiException = require('../exceptions/api.exception');
const StatusDto = require('../dtos/status.dto');

class StatusController {

    async getAllStatuses() {
        const statuses = await StatusModel.findAll();
        return statuses.map(status => new StatusDto(status));
    }

    async changeUserStatus(userDto, status) {
        const foundStatus = await StatusModel.findOne({where: {value: status.value}});

        if (!foundStatus) {
            ApiException.BadRequest('Status is not found');
        }

        const user = await UserModel.findOne({where: {hash: userDto.hash}});

        await user.update({statusId: foundStatus.id});
    }

}

module.exports = new StatusController();
