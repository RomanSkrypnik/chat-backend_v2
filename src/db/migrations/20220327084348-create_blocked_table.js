'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const {DataTypes} = Sequelize;

        return queryInterface.createTable('blocked_relations', {

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            relationId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'relations',
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
        return queryInterface.dropTable('blocked_relations');
    }
};
