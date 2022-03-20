'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.statuses, {
                as: 'status',
                foreignKey: {
                    name: 'statusId',
                    defaultValue: 1,
                    allowNull: false
                }
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

        },
        {
            sequelize,
            modelName: 'users',
            timestamps: false,
        });

    return User;
};
