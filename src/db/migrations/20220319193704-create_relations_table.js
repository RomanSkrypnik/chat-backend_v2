'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const {DataTypes} = Sequelize;

        return queryInterface.createTable('relations', {

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            user1Id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'users',
                    key: 'id',
                }
            },

            user2Id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'users',
                    key: 'id',
                }
            }
        });
    },

    async down(queryInterface, Sequelize) {
      return queryInterface.dropTable('relations');
    }
};
