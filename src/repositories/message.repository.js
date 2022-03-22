const sequelize = require('sequelize');

const MessageModel = require('../db').messages;
const UserModel = require('../db').users;
const FileModel = require('../db').files;

const ApiException = require('../exceptions/api.exception');

module.exports = class MessageRepository {

    static async createMessage(relationId, userId, text) {
        return MessageModel.create({
            text,
            relationId,
            userId,
        });
    }

    static async getMessageByPk(id) {
        const message = MessageModel.findByPk(id, {
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: UserModel,
                        as: 'sender',
                    },
                    {
                        model: FileModel,
                        as: 'files'
                    }
                ]
            }
        );

        if (!message) {
            return ApiException.BadRequest('Message is not found');
        }

        return message;
    }

    static async getMessageByPkWithFiles() {

    }

    static async getMessages(relationId, offset, limit, order = 'ASC') {
        return MessageModel.findAll({
            where: {relationId},
            attributes: ['id', 'text', 'isRead', 'createdAt', 'updatedAt'],
            order: sequelize.literal(`createdAt ${order}`),
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

};
