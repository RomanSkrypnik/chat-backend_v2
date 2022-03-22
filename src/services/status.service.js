const StatusModel = require('../db').statuses;

const UserRepository = require('../repositories/user.repository');
const StatusRepository = require('../repositories/status.repository');

const StatusDto = require('../dtos/status.dto');

class StatusController {

    async getAllStatuses() {
        const statuses = await StatusModel.findAll();

        return statuses.map(status => new StatusDto(status));
    }

    async changeUserStatus(userDto, statusVal) {
        const {id} = await StatusRepository.getByValue(statusVal);

        const user = await UserRepository.getUserByHash(userDto.hash);

        await user.update({statusId: id});
    }

}

module.exports = new StatusController();
