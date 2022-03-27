const BlockedModel = require('../db').blocked;

const {Op} = require('sequelize');

class BlockedRepository {

    async getOne(userId, relationId) {
        return await BlockedModel.findOne({where: {[Op.and]: {userId, relationId}}});
    }

    async create(userId, relationId) {
        return await BlockedModel.create({userId, relationId});
    }

    async destroy(userId, relationId) {
        return await BlockedModel.destroy({where: {userId, relationId}});
    }

}

module.exports = new BlockedRepository();
