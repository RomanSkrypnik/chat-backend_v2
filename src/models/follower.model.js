module.exports = (sequelize, DataTypes) => {
    const User = require('./user.model')(sequelize, DataTypes);

    const Follower = sequelize.define('Follower',
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
        },
        {
            timestamps: false,
            tableName: 'followers',
        }
    );

    Follower.belongsTo(User, {
        as: 'sender',
        foreignKey: {
            name: 'user1Id',
            allowNull: false
        }
    });

    Follower.belongsTo(User, {
        as: 'receiver',
        foreignKey: {
            name: 'user2Id',
            allowNull: false
        }
    });

    return Follower
}