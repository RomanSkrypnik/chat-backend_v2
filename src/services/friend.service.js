const FriendModel = require('../db/connection').friends;
const userService = require("./user.service");
const ApiException = require("../exceptions/api.exception");
const { Op } = require('sequelize');

class FriendService {

    async getFriends(email) {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            throw ApiException.BadRequest('User is not found');
        }

        const fields = [{user1Id: user.id}, {user2Id: user.id}];

        const friendsRelations =  await FriendModel.findAll({
            where: {
                [Op.or] : fields
            }
        });

        // friendsRelations
        //     .filter(relation => relation.user1Id);


    }

    async addFriend(sender, receiver) {
        const fields = await this._getSubscriptionFields(sender.email, receiver.email);
        return FriendModel.create(fields);
    }

    async _getSubscriptionFields(senderEmail, receiverEmail) {
        const foundSender = await userService.getUserByEmail(senderEmail);
        const foundReceiver = await userService.getUserByEmail(receiverEmail);

        if (foundSender || foundReceiver) {
            ApiException.BadRequest('Sender or receiver is not found');
        }

        return {
            user1Id: foundSender.id,
            user2Id: foundReceiver.id,
        }
    }

}

module.exports = new FriendService();