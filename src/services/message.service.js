const StarredModel = require('../db').starred;

const UserRepository = require('../repositories/user.repository');
const RelationRepository = require('../repositories/relation.repository');
const MessageRepository = require('../repositories/message.repository');

const ApiExceptions = require('../exceptions/api.exception');

class MessageService {

    async createMessage(user, hash, text) {
        const receiver = await UserRepository.getUserByHash(hash);

        const relation = await RelationRepository.getRelationOrCreate(user, receiver);

        const newMessage = await MessageRepository.createMessage(relation.id, user.id, text);

        return await MessageRepository.getMessageByPk(newMessage.id);
    }

    async readMessage(id) {
        const message = await MessageRepository.getMessageByPk(id);

        if (!message) {
            return ApiExceptions.BadRequest('There is not such message');
        }

        await message.update({isRead: true});
    }

    async stareMessage(user, messageId) {
        const {relationId} = await MessageRepository.getMessageByPk(messageId);

        const {user1Id, user2Id} = await RelationRepository.getRelationByPk(relationId);

        if (user1Id !== user.id) {
            if (user2Id !== user.id) {
                return ApiExceptions.BadRequest("User is not a sender or receiver");
            }
        }

        return await StarredModel.create({userId: user.id, messageId});
    }

    async clearChat(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const relation = await RelationRepository.getRelation(user, friend);

        if (!relation) {
            throw ApiExceptions.BadRequest('relation is not found');
        }

        return await MessageRepository.destroyAllMessagesFromRelation(relation.id);
    }

}

module.exports = new MessageService();
