'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('relations', [
            {
                user1Id: 1,
                user2Id: 2,
            },
            {
                user1Id: 1,
                user2Id: 3,
            },
            {
                user1Id: 2,
                user2Id: 3,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('relations', null, {});
    }
};
