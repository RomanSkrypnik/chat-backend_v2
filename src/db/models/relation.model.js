'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Relation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Relation.belongsTo(models.users, {
                as: 'sender',
                foreignKey: {
                    name: 'user1Id',
                    allowNull: false
                }
            });

            Relation.belongsTo(models.users, {
                as: 'receiver',
                foreignKey: {
                    name: 'user2Id',
                    allowNull: false,
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
            modelName: 'relations',
            timestamps: false,
        });

    return Relation;
};
