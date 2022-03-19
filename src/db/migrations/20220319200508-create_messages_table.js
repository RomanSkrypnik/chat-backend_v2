'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const {DataTypes} = Sequelize;

        return queryInterface.createTable('messages', {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            text: {
                type: DataTypes.TEXT,
            },

            isRead: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            relationId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'relations',
                    key: 'id'
                }
            },

            userId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'users',
                    key: 'id',
                }
            },

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('messages');
    }
};
