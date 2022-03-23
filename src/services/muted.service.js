const UserRepository = require('../repositories/user.repository');
const RelationRepository = require('../repositories/relation.repository');
const MutedRepository = require('../repositories/muted.repository');

const UserDto = require('../dtos/user.dto');

const ApiException = require('../exceptions/api.exception');

class MutedService {

    async muteRelation(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const friendRelation = await RelationRepository.getRelation(user, friend);

        if (!friendRelation) {
            throw ApiException.BadRequest('Relation is not found');
        }

        const {id} = await MutedRepository.create(friendRelation.id, user.id);

        const {relation} = await MutedRepository.getByPk(id);

        const {sender, receiver} = relation;

        if (sender.hash === user.hash) {
            return new UserDto({...receiver.dataValues, isMuted: true});
        }

        return new UserDto({...sender.dataValues, isMuted: true});
    }

    async unmuteRelation(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const {id} = await RelationRepository.getRelation(user, friend);

        if (!id) {
            throw ApiException.BadRequest('Relation is not found');
        }

        await MutedRepository.destroy(id, user.id);

        return new UserDto({...friend.dataValues, isMuted: false});
    }

}

module.exports = new MutedService();
