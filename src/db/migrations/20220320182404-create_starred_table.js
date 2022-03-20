'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const {DataTypes} = Sequelize;

        return queryInterface.createTable('starred_messages', {

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            messageId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'messages',
                    key: 'id',
                }
            },

            userId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }

        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('starred_messages');
    }
};
