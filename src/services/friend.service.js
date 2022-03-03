const FriendModel = require('../db/connection').friends;
const userService = require("./user.service");
const messageService = require("./message.service");
const UserDto = require('../dtos/user.dto');
const UserModel = require('../db/connection').users;
const StatusModel = require('../db/connection').statuses;
const {Op} = require('sequelize');

class FriendService {

    async getFriendsWithMessages(user) {
        const friends = await this.getFriends(user);

        return Promise.all(friends.map(async friend => {
            const messages = await messageService.getMessages(user, friend, 0, 40, 'DESC');
            return {friend: new UserDto(friend), messages: messages?.reverse()};
        }));
    }

    async removeFriend(user, hash) {
        const friend = await userService.getUserByHash(hash);
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

}

module.exports = new FriendService();
