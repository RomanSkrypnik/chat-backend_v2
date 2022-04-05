const RelationModel = require('../db').relations;
const UserModel = require('../db').users;
const StatusModel = require('../db').statuses;
const MutedModel = require('../db').muted;
const BlockedModel = require('../db').blocked;

const {Op} = require('sequelize');

module.exports = class RelationRepository {

    static async getUserRelations(user) {
        const condition = [{user1Id: user.id}, {user2Id: user.id}];

        return await RelationModel.findAll({
            where: {
                [Op.or]: condition,
            },
            include: [

                {
                    model: UserModel,
                    as: 'sender',
                    attributes: ['id', 'hash', 'username', 'name', 'isActivated', 'isOnline', 'pictureUrl'],
                    include: {
                        model: StatusModel,
                        as: 'status'
                    }
                },

                {
                    model: UserModel,
                    as: 'receiver',
                    attributes: ['id', 'hash', 'username', 'name', 'isActivated', 'isOnline', 'pictureUrl'],
                    include: {
                        model: StatusModel,
                        as: 'status',
                    }
                },

                {
                    model: MutedModel,
                    as: 'muted',
                },

                {
                    model: BlockedModel,
                    as: 'blocked'
                }
            ]
        });
    }

    static async getRelation(firstUser, secondUser) {

        const condition = [
            {user1Id: firstUser.id, user2Id: secondUser.id},
            {user1Id: secondUser.id, user2Id: firstUser.id}
        ];

        return await RelationModel.findOne({
            where: {[Op.or]: condition},
            include: [
                {
                    model: UserModel,
                    as: 'sender',
                    attributes: ['id', 'hash', 'username', 'name', 'isActivated', 'isOnline', 'pictureUrl'],
                    include: {
                        model: StatusModel,
                        as: 'status'
                    }
                },

                {
                    model: UserModel,
                    as: 'receiver',
                    attributes: ['id', 'hash', 'username', 'name', 'isActivated', 'isOnline', 'pictureUrl'],
                    include: {
                        model: StatusModel,
                        as: 'status',
                    }
                },

                {
                    model: MutedModel,
                    as: 'muted',
                },

                {
                    model: BlockedModel,
                    as: 'blocked',
                }
            ]
        });
    }

    static async getRelationOrCreate(firstUser, secondUser) {

        const condition = [
            {user1Id: firstUser.id, user2Id: secondUser.id},
            {user1Id: secondUser.id, user2Id: firstUser.id}
        ];

        const [relation] = await RelationModel.findOrCreate({
            where: {[Op.or]: condition},
            defaults: condition[0],
        });

        return relation;
    }

    static async getRelationByPk(id) {
        return RelationModel.findByPk(id);
    }

    static async create(columns) {
        return RelationModel.create(columns);
    }

};
