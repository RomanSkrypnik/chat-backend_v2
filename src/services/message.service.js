const UserModel = require('../db/connection').users;
const FriendModel = require('../db/connection').friends;
const MessageModel = require('../db/connection').messages;
const FileModel = require('../db/connection').files;
const userService = require('./user.service');
const { Op } = require('sequelize');

class MessageService {

    async createMessage(user, hash, message) {
        const receiver = await userService.getUserByHash(hash);
        const condition = this._getCondition(user, receiver);
        const relation = await FriendModel.findOne({where: {[Op.or]: condition}});

        return MessageModel.create({
            text: message.text,
            relationId: relation.id,
            userId: user.id,
        });
    }

    async getMessages(firstUser, secondUser, offset, limit) {
        const condition = this._getCondition(firstUser, secondUser);
        const relation = await FriendModel.findOne({where: {[Op.or]: condition}});

        return MessageModel.findAll({
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
