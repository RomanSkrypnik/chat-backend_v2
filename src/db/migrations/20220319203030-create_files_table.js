'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const {DataTypes} = Sequelize;

        return queryInterface.createTable('files', {

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            originalName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            uniqueName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            messageId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'messages',
                    key: 'id',
                }
            },

        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('files');
    }
};
