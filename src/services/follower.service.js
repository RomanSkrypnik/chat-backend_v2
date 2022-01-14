const FollowerModel = require('../db/connection').followers;
const UserModel = require('../db/connection').users;
const StatusModel = require('../db/connection').statuses;
const userService = require('./user.service');
const friendService = require('./friend.service');
const ApiException = require('../exceptions/api.exception');
const UserDto = require('../dtos/user.dto');
const { Op } = require("sequelize");

class FollowerService {

    async getFollowings(email) {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            throw ApiException.BadRequest('User is not found');
        }

        const followers = await FollowerModel.findAll({
            where: {user1Id: user.id},
            include: {
                model: UserModel,
                as: 'receiver',
                include: {
                    model: StatusModel,
                    as: 'status'
                }
            }
        });
        return followers.map(follower => new UserDto(follower.receiver));
    }

    async getFollowers(email) {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            throw ApiException.BadRequest('User is not found');
        }

        const followers = await FollowerModel.findAll({
            where: {user2Id: user.id},
            include: {
                model: UserModel,
                as: 'sender',
                include: {
                    model: StatusModel,
                    as: 'status'
                }
            }
        });
        return followers.map(follower => new UserDto(follower.sender));
    }

    async createFollow(sender, receiver) {
        const fields = await this._getSubscriptionFields(sender.email, receiver.email);
        return FollowerModel.create(fields);
    }

    async removeFollow(sender, receiver) {
        const fields = await this._getSubscriptionFields(sender.email, receiver.email);
        const reversedFields = {user1Id: fields.user2Id, user2Id: fields.user1Id};
        return FollowerModel.destroy({
            where: {
                [Op.or]: [
                    fields,
                    reversedFields
                ]
            }
        });
    }

    async addFollower(sender, receiver) {
        // TODO :: Vulnerability
        await this._getSubscriptionFields(sender.email, receiver.email);
        return await friendService.addFriend(sender, receiver);
    }

    async _getSubscriptionFields(senderEmail, receiverEmail) {
        const foundSender = await userService.getUserByEmail(senderEmail);
        const foundReceiver = await userService.getUserByEmail(receiverEmail);

        if (!foundSender || !foundReceiver) {
            throw ApiException.BadRequest('Sender or receiver is not found');
        }

        return {
            user1Id: foundSender.id,
            user2Id: foundReceiver.id,
        }
    }

}

module.exports = new FollowerService();