const RelationRepository = require('../repositories/relation.repository');
const BlockedRepository = require('../repositories/blocked.repository');

const userFacade = require('../facades/user.facade');

const UserDto = require('../dtos/user.dto');

const ApiException = require('../exceptions/api.exception');

class BlockedService {

    async blockUser(user, hash) {
        const friend = await userFacade.getUser(user, hash);

        const relation = await RelationRepository.getRelation(user, friend);

        if (!relation) {
            throw ApiException.BadRequest('Relation is not found');
        }

        await BlockedRepository.create(user.id, relation.id);

        return new UserDto({...friend, isBlocked: true, isBlockedByMe: true});
    }

    async unblockUser(user, hash) {
        const friend = await userFacade.getUser(user, hash);

        const relation = await RelationRepository.getRelation(user, friend);

        if (!relation) {
            throw ApiException.BadRequest('Relation is not found');
        }

        await BlockedRepository.destroy(user.id, relation.id);

        const anyBlockedRelation = !!await BlockedRepository.getOne(friend.id, relation.id);

        return new UserDto({...friend, isBlocked: anyBlockedRelation, isBlockedByMe: false});
    }
}

module.exports = new BlockedService();
