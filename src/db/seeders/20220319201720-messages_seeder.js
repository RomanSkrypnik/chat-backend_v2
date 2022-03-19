'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('messages', [
            {
                userId: 1,
                relationId: 1,
                text: 'hello',
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            {
                userId: 1,
                relationId: 2,
                text: 'hello',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('messages', null, {});
    }
};
