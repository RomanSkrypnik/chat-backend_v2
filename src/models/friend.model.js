module.exports = (sequelize, DataTypes) => {
    const User = require('../models/user.model')(sequelize, DataTypes);

    const Friend = sequelize.define('Friend',
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
        },
        {
            timestamps: false,
            tableName: 'friends',
        }
    );

    Friend.belongsTo(User,{
        as: 'sender',
        foreignKey: {
            name:'user1Id',
            allowNull: false
        }
    });

    Friend.belongsTo(User,{
        as: 'receiver',
        foreignKey: {
            name:'user2Id',
            allowNull: false
        }
    });

    return Friend;
}