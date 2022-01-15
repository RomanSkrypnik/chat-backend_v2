const FollowerModel = require('../db/connection').followers;
const UserModel = require('../db/connection').users;
const StatusModel = require('../db/connection').statuses;
const userService = require('./user.service');
const friendService = require('./friend.service');
const ApiException = require('../exceptions/api.exception');
const UserDto = require('../dtos/user.dto');
const { Op } = require("sequelize");

class FollowerService {

    async getFollowings(user) {
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

    async getFollowers(user) {
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

    async createFollow(user, followingHash) {
        const fields = await this._getSubscriptionFields(user, followingHash);
        return FollowerModel.create(fields);
    }

    async removeFollow(user, followingHash) {
        const fields = await this._getSubscriptionFields(user, followingHash);
        const reversedFields = {user1Id: fields.user2Id, user2Id: fields.user1Id};

        return await FollowerModel.destroy({
            where: {
                [Op.or]: [
                    fields,
                    reversedFields
                ]
            }
        });
    }

    async addFollower(user, followerHash) {
        const sender = await UserModel.findOne({where: {hash: followerHash}});
        const followerRelation = await FollowerModel.findOne({where: {user1Id: sender.id, user2Id: user.id}});

        if (!followerRelation) {
            throw ApiException.BadRequest('Sender cannot add his followings to friends');
        }

        await this.removeFollow(user, followerHash);
        return await friendService.addFriend(user, followerHash);
    }

    async _getSubscriptionFields(user, hash) {
        const secondUser = await userService.getUserByHash(hash);

        if (!secondUser) {
            throw ApiException.BadRequest('Sender or receiver is not found');
        }

        return {
            user1Id: user.id,
            user2Id: secondUser.id,
        }
    }

}

module.exports = new FollowerService();
