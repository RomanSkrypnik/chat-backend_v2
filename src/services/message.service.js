const UserModel = require('../db').users;
const RelationModel = require('../db').relations;
const MessageModel = require('../db').messages;
const FileModel = require('../db').files;
const StarredModel = require('../db').starred;

const {sequelize} = require('../db');

const ApiExceptions = require('../exceptions/api.exception');

const {Op} = require('sequelize');

class MessageService {

    async createTextMessage(user, hash, text) {
        const receiver = await UserModel.findOne({where: {hash}});

        const condition = this._getCondition(user, receiver);

        const [relation] = await RelationModel.findOrCreate({
            where: {[Op.or]: condition},
            defaults: condition[0],
        });

        const newMessage = await MessageModel.create({
            text,
            relationId: relation.id,
            userId: user.id,
        });

        return MessageModel.findByPk(newMessage.id, {
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: UserModel,
                        as: 'sender',
                    },
                ]
            }
        );
    }

    async updateMessage(messageId, text) {
        const message = await MessageModel.findByPk(messageId, {
            attributes: ['id', 'text', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: UserModel,
                    as: 'sender',
                },
                {
                    model: FileModel,
                    as: 'files',
                }
            ]
        });

        if (!message) {
            return ApiExceptions.BadRequest('Message is not found');
        }

        await message.update({text});

        return message;
    }

    async getMessages(firstUser, secondUser, offset, limit, order = 'ASC') {
        const condition = this._getCondition(firstUser, secondUser);
        const relation = await RelationModel.findOne({where: {[Op.or]: condition}});

        if (!relation) {
            return null;
        }

        return MessageModel.findAll({
            attributes: ['id', 'text', 'isRead', 'createdAt', 'updatedAt'],
            order: sequelize.literal(`createdAt ${order}`),
            where: {
                relationId: relation.id
            },
            include: [
                {
                    model: UserModel,
                    as: 'sender',
                    attributes: ['id', 'hash', 'username', 'pictureUrl', 'isActivated'],
                },
                {
                    model: FileModel,
                    as: 'files',
                }
            ],
            limit,
            offset,
        });
    }

    async readMessage(id) {
        const message = await MessageModel.findByPk(id);

        if (!message) {
            return ApiExceptions.BadRequest('There is not such message');
        }

        await message.update({isRead: true});
    }

    async getMessageById(id) {
        const message = await MessageModel.findOne({
            where: {id},
            include: [
                {
                    model: UserModel,
                    as: 'sender'
                },
                {
                    model: FileModel,
                    as: 'files'
                }
            ]
        });

        if (!message) {
            return ApiExceptions.BadRequest('Message is not found');
        }

        return message;
    }

    async stareMessage(user, messageId) {
        const message = await MessageModel.findByPk(messageId);

        if (!message) {
            return ApiExceptions.BadRequest('Message is not found');
        }

        const relation = await RelationModel.findByPk(message.relationId);

        if (relation.user1Id !== user.id) {
            if (relation.user2Id !== user.id) {
                return ApiExceptions.BadRequest("User is not a sender or receiver");
            }
        }

        return await StarredModel.create({userId: user.id, messageId});
    }


    _getCondition(firstUser, secondUser) {
        return [{user1Id: firstUser.id, user2Id: secondUser.id}, {user1Id: secondUser.id, user2Id: firstUser.id}]
    }

}

module.exports = new MessageService();
