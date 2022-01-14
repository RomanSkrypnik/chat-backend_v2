const FriendModel = require('../db/connection').friends;
const userService = require("./user.service");
const ApiException = require("../exceptions/api.exception");

class FriendService {

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