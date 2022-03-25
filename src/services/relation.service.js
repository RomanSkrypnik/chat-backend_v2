const RelationRepository = require('../repositories/relation.repository');
const UserRepository = require('../repositories/user.repository');

class RelationService {

    async removeFriend(user, hash) {
        const friend = await UserRepository.getUserByHash(hash);

        const relation = await RelationRepository.getRelation(user, friend);

        await relation.destroy();
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
