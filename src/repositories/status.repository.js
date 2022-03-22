const StatusModel = require('../db').statuses;

const ApiException = require('../exceptions/api.exception');

module.exports = class StatusRepository {

    static async getByValue(value) {
        const status = await StatusModel.findOne({where: {value}});

        if (!status) {
            return ApiException.BadRequest('Status with such value is not found');
        }

        return status;
    }

};
