const UserModel = require('../db/connection').users;
const FriendModel = require('../db/connection').friends;
const MessageModel = require('../db/connection').messages;
const FileModel = require('../db/connection').files;
const {Op} = require('sequelize');
const {sequelize} = require('../db/connection');
const ApiExceptions = require('../exceptions/api.exception');
const SharpHelper = require('../helpers/sharp.helper');

class MessageService {

    async createMessage(user, hash, text, files) {
        const receiver = await UserModel.findOne({where: {hash}});

        const condition = this._getCondition(user, receiver);

        const [relation] = await FriendModel.findOrCreate({
            where: {[Op.or]: condition},
            defaults: condition[0],
        });

        const newMessage = await MessageModel.create({
            text,
            relationId: relation.id,
            userId: user.id,
        });

        if (files) {
            const rows = files.map(file => {
                return {
                    originalName: file.originalname,
                    uniqueName: file.filename,
                    messageId: +newMessage.id
                }
            });

            for (const file of files) {
                await SharpHelper.compressPicture('./public/img/messages/' + file.filename);
            }

            await FileModel.bulkCreate(rows);
        }

        return MessageModel.findByPk(newMessage.id, {
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
        const relation = await FriendModel.findOne({where: {[Op.or]: condition}});

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



    _getCondition(firstUser, secondUser) {
        return [{user1Id: firstUser.id, user2Id: secondUser.id}, {user1Id: secondUser.id, user2Id: firstUser.id}]
    }

}

module.exports = new MessageService();
