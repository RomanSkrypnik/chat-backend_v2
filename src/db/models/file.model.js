'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class File extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            File.belongsTo(models.Message, {
                as: 'message',
                foreignKey: {
                    name: 'messageId',
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });
        }
    }

    File.init({

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            originalName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            uniqueName: {
                type: DataTypes.STRING,
                allowNull: false,
            }


        },
        {
            sequelize,
            modelName: 'File',
            tableName: 'files',
            timestamps: false,
        });

    return File;
};
