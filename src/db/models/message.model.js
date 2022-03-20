'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Message.hasMany(models.files, {
                as: 'files',
                foreignKey: {
                    name: 'messageId',
                    allowNull: false,
                }
            });

            Message.belongsTo(models.relations, {
                    as: 'relation',
                    foreignKey: {
                        name: 'relationId',
                        allowNull: false,
                    }
                }
            );

            Message.belongsTo(models.users, {
                as: 'sender',
                foreignKey: {
                    name: 'userId',
                    allowNull: false,
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
            modelName: 'messages',
            timestamps: true,
        });

    return Message;
};
