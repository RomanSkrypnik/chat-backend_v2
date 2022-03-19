'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('statuses', [
            {
                name: 'free',
                value: 'f'
            },
            {
                name: 'working',
                value: 'w'
            },
            {
                name: 'busy',
                value: 'b'
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('statuses', null, {});
    }
};
