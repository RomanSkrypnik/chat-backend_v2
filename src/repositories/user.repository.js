const UserModel = require('../db').users;
const StatusModel = require('../db').statuses;

const ApiException = require('../exceptions/api.exception');

module.exports = class UserRepository {

    static async getAll() {
        return await UserModel.findAll();
    }

    static async getUserByHash(hash) {
        const user = await UserModel.findOne({
            where: {hash},
            include: {
                model: StatusModel,
                as: 'status'
            }
        });

        if (!user) {
            throw ApiException.BadRequest('User is not found');
        }

        return user;
    }

    static async getUserByEmail(email) {
        return await UserModel.findOne({
            where: {email},
            include: {
                model: StatusModel,
                as: 'status'
            }
        });
    }

    static async getUsersBySearch(search, user) {
        const field = search.startsWith('@') ? 'username' : 'name';

        return await UserModel.findAll({
            where: {
                [field]: {
                    [Op.startsWith]: search,
                    [Op.not]: user[field]
                },
            },
            include: {
                model: StatusModel,
                as: 'status'
            }
        });
    }

    static async create(data) {
        // TODO :: enumerate all required columns
        await UserModel.create(data);
    }

};
