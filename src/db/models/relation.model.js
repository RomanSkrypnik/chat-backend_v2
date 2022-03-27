'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Relation extends Model {
        static associate(models) {

            Relation.belongsTo(models.User, {
                as: 'sender',
                foreignKey: {
                    name: 'user1Id',
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });

            Relation.belongsTo(models.User, {
                as: 'receiver',
                foreignKey: {
                    name: 'user2Id',
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });

            Relation.hasMany(models.Muted, {
                as: 'muted',
                foreignKey: {
                    name: 'relationId',
                    allowNull: false,
                    onDelete: 'cascade'
                }
            });

            Relation.hasMany(models.Blocked, {
                as: 'blocked',
                foreignKey: {
                    name: 'relationId',
                    allowNull: false,
                    onDelete: 'cascade',
                }
            })

        }
    }

    Relation.init({

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },

        },
        {
            sequelize,
            modelName: 'Relation',
            tableName: 'relations',
            timestamps: false,
        });

    return Relation;
};
