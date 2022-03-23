'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Muted extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            Muted.belongsTo(models.Relation, {
                foreignKey: 'relationId',
                as: 'relation',
                onDelete: 'cascade'
            });

            Muted.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
                onDelete: 'cascade'
            });
        }
    }


    Muted.init({

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
            modelName: 'Muted',
            tableName: 'muted_relations',
            timestamps: false,
        });

    return Muted;
};
