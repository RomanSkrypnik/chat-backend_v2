const FriendModel = require('../db/connection').friends;
const messageService = require("./message.service");
const UserDto = require('../dtos/user.dto');
const UserModel = require('../db/connection').users;
const StatusModel = require('../db/connection').statuses;
const {Op} = require('sequelize');
const ApiExceptions = require('../exceptions/api.exception');

class FriendService {

    async getFriendsWithMessages(user) {
        const friends = await this.getFriends(user);

        return Promise.all(friends.map(async friend => {
            const friendMessages = await messageService.getMessages(user, friend, 0, 40, 'DESC');

            const messages = friendMessages ? friendMessages.reverse() : [];

            return {friend: new UserDto(friend), messages};
        }));
    }

    async getFriendWithMessages(user, hash) {
        const friend = await UserModel.findOne({
            where: {hash},
            include: {
                model: StatusModel,
                as: 'status'
            }
        });

        const friendMessages = await messageService.getMessages(user, friend, 0, 40, 'DESC');

        const messages = friendMessages ? friendMessages.reverse() : [];

        return {friend: new UserDto(friend), messages};
    }

    async removeFriend(user, hash) {
        const friend = await UserModel.findOne({where: {hash}});
        const condition = [{user1Id: user.id, user2Id: friend.id}, {user1Id: friend.id, user2Id: user.id}];

        const friendRelation = await FriendModel.findOne({where: {[Op.or]: condition}});
        await friendRelation.destroy();
    }

    async getFriends(user) {
        const condition = [{user1Id: user.id}, {user2Id: user.id}];

        const friendsRelations = await FriendModel.findAll({
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
                }
            ]
        });

        return friendsRelations.map(relation => relation.sender.id === user.id ? relation.receiver : relation.sender);
    }

    async getFriendRelation(user, hash) {
        const friend = await UserModel.findOne({where: {hash}});

        if (!friend) {
            return ApiExceptions.BadRequest('User is not found');
        }

        const condition = this._getCondition(user, friend);

        const relation = await FriendModel.findOne({
            where: {[Op.or]: condition},
        });

        if (!relation) {
            return await FriendModel.create({user1Id: user.id, user2Id: friend.id});
        }

        return relation;
    }

    _getCondition(firstUser, secondUser) {
        return [{user1Id: firstUser.id, user2Id: secondUser.id}, {user1Id: secondUser.id, user2Id: firstUser.id}]
    }
}

module.exports = new FriendService();
