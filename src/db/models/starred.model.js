'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Starred extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Starred.belongsTo(models.messages, {
                as: 'messages',
                foreignKey: {
                    name: 'messageId',
                    allowNull: false,
                }
            });

            Starred.belongsTo(models.users, {
                as: 'user',
                foreignKey: {
                    name: 'userId',
                    allowNull: false,
                }
            });
        }
    }

    Starred.init({

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

        },
        {
            sequelize,
            modelName: 'starred_messages',
            timestamps: true,
        });

    return Starred;
};
