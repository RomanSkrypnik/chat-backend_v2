const UserModel = require('../db/connection').users;
const FriendModel = require('../db/connection').friends;
const MessageModel = require('../db/connection').messages;
const FileModel = require('../db/connection').files;
const { Op } = require('sequelize');
const { sequelize } = require('../db/connection');

class MessageService {

    async createMessage(user, hash, message) {
        const receiver = await UserModel.findOne({where: {hash: hash}});
        const condition = this._getCondition(user, receiver);
        let relation = await FriendModel.findOne({where: {[Op.or]: condition}});

        if (!relation) {
            relation = await FriendModel.create({user1Id: user.id, user2Id: receiver.id});
        }

        const newMessage = await MessageModel.create({
            text: message.text,
            relationId: relation.id,
            userId: user.id,
        });

        return MessageModel.findByPk(newMessage.id, {
                attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                include: {
                    model: UserModel,
                    as: 'sender',
                }
            }
        );
    }

    async getMessages(firstUser, secondUser, offset, limit, order = 'ASC') {
        const condition = this._getCondition(firstUser, secondUser);
        const relation = await FriendModel.findOne({where: {[Op.or]: condition}});

        if (!relation) {
            return null;
        }

        return MessageModel.findAll({
            attributes: ['id', 'text', 'createdAt', 'updatedAt'],
            order: sequelize.literal(`createdAt ${order}`),
            where: {
                relationId: relation.id
            },
            include: [
                {
                    model: FileModel,
                    as: 'file'
                },
                {
                    model: UserModel,
                    as: 'sender',
                    attributes: ['id', 'hash', 'username', 'pictureUrl', 'isActivated'],
                }
            ],
            limit,
            offset,
        });
    }

    _getCondition(firstUser, secondUser) {
        return [{user1Id: firstUser.id, user2Id: secondUser.id}, {user1Id: secondUser.id, user2Id: firstUser.id}]
    }

}

module.exports = new MessageService();
