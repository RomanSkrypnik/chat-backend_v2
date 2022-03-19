'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;

    return queryInterface.createTable('statuses', {

      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      value: {
        type: DataTypes.STRING,
        allowNull: false
      }


    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('statuses');
  }
};
