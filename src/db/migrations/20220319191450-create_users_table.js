'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;

    return queryInterface.createTable('users', {

      id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      statusId: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        references: {
          model: 'statuses',
          key: 'id',
        }
      },

      activity: {
        type: DataTypes.STRING,
      },

      pictureUrl: {
        type: DataTypes.STRING,
      },

      activationLink: {
        type: DataTypes.STRING,
      },

      isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }

    });
  },

  async down (queryInterface, Sequelize) {
      return queryInterface.dropTable('users');
  }
};
