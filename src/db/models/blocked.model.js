'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Blocked extends Model {
        static associate(models) {

            Blocked.belongsTo(models.Relation, {
                foreignKey: 'relationId',
                as: 'relation',
                onDelete: 'cascade'
            });

            Blocked.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
                onDelete: 'cascade'
            });
        }
    }


    Blocked.init({

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            relationId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'relations',
                    key: 'id',
                }
            },

            userId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }


        },
        {
            sequelize,
            modelName: 'Blocked',
            tableName: 'blocked_relations',
            timestamps: false,
        });

    return Blocked;
};
