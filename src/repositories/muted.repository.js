const MutedModel = require('../db').muted;
const RelationModel = require('../db').relations;
const UserModel = require('../db').users;
const StatusModel = require('../db').statuses;

module.exports = class MutedRepository {

    static async getByPk(id) {
        return await MutedModel.findOne({
            where: {id},
            include: {
                model: RelationModel,
                as: 'relation',
                include: [
                    {
                        model: UserModel,
                        as: 'sender',
                        include: {
                            model: StatusModel,
                            as: 'status',
                        }
                    },
                    {
                        model: UserModel,
                        as: 'receiver',
                        include: {
                            model: StatusModel,
                            as: 'status',
                        }
                    }
                ],
            }
        });
    }

    static async create(relationId, userId) {
        return await MutedModel.create({relationId, userId});
    }

    static async destroy(relationId, userId) {
        return await MutedModel.destroy({where: {relationId, userId}});
    }

};
