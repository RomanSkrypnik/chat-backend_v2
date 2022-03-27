'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Status, {
                as: 'status',
                foreignKey: 'statusId',
                onDelete: 'cascade'
            });

        }
    }

    User.init({

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },

            username: {
                type: DataTypes.STRING,
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

        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: false,
        });

    return User;
};
