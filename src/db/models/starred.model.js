'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Starred extends Model {
        static associate(models) {
            Starred.belongsTo(models.Message, {
                as: 'messages',
                foreignKey: {
                    name: 'messageId',
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });

            Starred.belongsTo(models.User, {
                as: 'user',
                foreignKey: {
                    name: 'userId',
                    allowNull: false,
                    onDelete: 'cascade'
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
            modelName: 'Starred',
            tableName: 'starred_messages',
            timestamps: true,
        });

    return Starred;
};
