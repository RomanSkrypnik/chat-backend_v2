'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Message extends Model {
        static associate(models) {
            Message.hasMany(models.File, {
                as: 'files',
                foreignKey: {
                    name: 'messageId',
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });

            Message.belongsTo(models.Relation, {
                    as: 'relation',
                    foreignKey: {
                        name: 'relationId',
                        allowNull: false,
                        onDelete: 'cascade'
                    }
                }
            );

            Message.belongsTo(models.User, {
                as: 'sender',
                foreignKey: {
                    name: 'userId',
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });
        }
    }

    Message.init({

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },

            text: {
                type: DataTypes.TEXT,
            },

            isRead: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

        },
        {
            sequelize,
            modelName: 'Message',
            tableName: 'messages',
            timestamps: true,
        });

    return Message;
};
