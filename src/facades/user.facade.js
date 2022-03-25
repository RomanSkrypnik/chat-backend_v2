const MessageRepository = require('../repositories/message.repository');
const UserRepository = require('../repositories/user.repository');
const RelationRepository = require('../repositories/relation.repository');

const UserDto = require('../dtos/user.dto');

const ApiException = require('../exceptions/api.exception');


class UserFacade {


    async getUsersWithMessages(user) {
        const friends = await this._getFriends(user);
        return Promise.all(friends.map(async friend => await this._getFormattedFriend(user, friend)));
    }

    async getUser(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const relation = await RelationRepository.getRelation(user, friend);

        if (!relation) {
            return ApiException.BadRequest('Relation is not found');
        }

        const isMuted = this._checkIfMuted(relation.muted, user.id);

        return new UserDto({...friend.dataValues, isMuted});
    }

    async getUsers(user) {
        return await this._getFriends(user);
    }

    async getUserWithMessages(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const relation = await RelationRepository.getRelation(user, friend);

        if (!relation) {
            return ApiException.BadRequest('Relation is not found');
        }

        return this._getFormattedFriend(user, {...friend.dataValues, muted: relation.muted, relationId: relation.id});
    }


    async _getFormattedFriend(user, friend) {
        const {relationId} = friend;

        const isMuted = this._checkIfMuted(friend.muted, user.id);

        const friendMessages = await MessageRepository.getMessages(relationId, 0, 40, 'DESC');

        const messages = friendMessages ? friendMessages.reverse() : [];

        return {friend: new UserDto({...friend, isMuted}), messages};
    }

    async _getFriends(user) {
        const relations = await RelationRepository.getUserRelations(user);

        return relations.map(relation => {
            const {sender} = relation;

            if (sender.id === user.id) {
                return {...relation.receiver.dataValues, relationId: relation.id, muted: relation.muted}
            }
            return {...relation.sender.dataValues, relationId: relation.id, muted: relation.muted}
        });
    }

    _checkIfMuted(mutedRelations, userId) {
        return mutedRelations.some(mutedRelation => mutedRelation.userId === userId);
    }

}

module.exports = new UserFacade();
