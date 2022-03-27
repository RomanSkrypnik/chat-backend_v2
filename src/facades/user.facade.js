const MessageRepository = require('../repositories/message.repository');
const UserRepository = require('../repositories/user.repository');
const RelationRepository = require('../repositories/relation.repository');

const UserDto = require('../dtos/user.dto');

const ApiException = require('../exceptions/api.exception');


class UserFacade {


    async getUsersWithMessages(user) {
        const friends = await this._getFriends(user);
        return Promise.all(friends.map(async friend => {
            const friendMessages = await MessageRepository.getMessages(friend.relationId, 0, 40, 'DESC');

            const messages = friendMessages ? friendMessages.reverse() : [];

            return {friend: new UserDto(friend), messages};
        }));
    }

    async getUsers(user) {
        return await this._getFriends(user);
    }

    async getUser(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const relation = await RelationRepository.getRelation(user, friend);

        if (!relation) {
            return ApiException.BadRequest('Relation is not found');
        }

        const isMuted = this._checkRelationsIf(relation.muted, user.id);
        const isBlockedByMe = !!this._checkRelationsIf(relation.blocked, user.id);
        const isBlocked = isBlockedByMe ? isBlockedByMe : !!this._checkRelationsIf(relation.blocked, friend.id);

        return {...friend.dataValues, relationId: relation.id, isMuted, isBlockedByMe, isBlocked};
    }

    async getUserWithMessages(user, hash) {
        const friend = await this.getUser(user, hash);

        const friendMessages = await MessageRepository.getMessages(friend.relationId, 0, 40, 'DESC');

        const messages = friendMessages ? friendMessages.reverse() : [];

        return {friend: new UserDto(friend), messages};
    }

    async _getFriends(user) {
        const relations = await RelationRepository.getUserRelations(user);

        return relations.map(relation => {
            const friend = relation.sender.id === user.id ? relation.receiver : relation.sender;

            const isMuted = this._checkRelationsIf(relation.muted, user.id);
            const isBlockedByMe = !!this._checkRelationsIf(relation.blocked, user.id);
            const isBlocked = isBlockedByMe ? isBlockedByMe : !!this._checkRelationsIf(relation.blocked, friend.id);

            return {...friend.dataValues, relationId: relation.id, isMuted, isBlockedByMe, isBlocked};
        });
    }

    _checkRelationsIf(relations, userId) {
        return relations.some(relation => relation.userId === userId);
    }

}

module.exports = new UserFacade();
