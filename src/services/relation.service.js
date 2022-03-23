const RelationModel = require('../db').relations;

const RelationRepository = require('../repositories/relation.repository');
const UserRepository = require('../repositories/user.repository');
const MessageRepository = require('../repositories/message.repository');

const UserDto = require('../dtos/user.dto');

const ApiExceptions = require('../exceptions/api.exception');

class RelationService {

    async getFriendsWithMessages(user) {
        const friends = await this.getFriends(user);

        return Promise.all(friends.map(async friend => {
            const friendMessages = await MessageRepository.getMessages(friend.relationId, 0, 40, 'DESC');
            const messages = friendMessages ? friendMessages.reverse() : [];

            return {friend: new UserDto(friend), messages};
        }));
    }

    async getFriendWithMessages(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const {id} = await RelationRepository.getRelation(user, friend);

        if (!id) {
            return ApiExceptions.BadRequest('Relation is not found');
        }

        const friendMessages = await MessageRepository.getMessages(id, 0, 40, 'DESC');

        const messages = friendMessages ? friendMessages.reverse() : [];

        return {friend: new UserDto(friend), messages};
    }

    async removeFriend(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const relation = await RelationRepository.getRelation(user, friend);

        await relation.destroy();
    }

    async getFriends(user) {
        const friendsRelations = await RelationRepository.getUserRelations(user);

        return friendsRelations.map(relation => {
            const mutedRelations = relation.muted;
            let isMuted = false;

            if (mutedRelations.length > 0) {
                isMuted = mutedRelations.some(relation => relation.userId === user.id);
            }

            if (relation.sender.id === user.id) {
                return {...relation.receiver.dataValues, relationId: relation.id, isMuted};
            }
            return {...relation.sender.dataValues, relationId: relation.id, isMuted};
        });
    }

    async getFriendRelation(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const relation = await RelationRepository.getRelation(user, friend);

        if (!relation) {
            return await RelationRepository.create({user1Id: user.id, user2Id: friend.id});
        }
        return relation;
    }
}

module.exports = new RelationService();
