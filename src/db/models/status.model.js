'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Status extends Model {
        static associate(models) {
            // define association here
        }
    }


    Status.init({

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
            },


        },
        {
            sequelize,
            modelName: 'Status',
            tableName: 'statuses',
            timestamps: false,
        });

    return Status;
};
