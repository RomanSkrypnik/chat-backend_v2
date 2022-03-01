module.exports = (sequelize, DataTypes) => {

    const Friend = require('./friend.model')(sequelize, DataTypes);
    const User = require('./user.model')(sequelize, DataTypes);

    const Message = sequelize.define('Message',
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            text: {
                type: DataTypes.TEXT,
            },

            isRead: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            }
        },
        {
            tableName: 'messages',
            timestamps: true,
        }
    );

    Message.belongsTo(Friend, {
            as: 'relation',
            foreignKey: {
                name: 'relationId',
                allowNull: false,
            }
        }
    );

    Message.belongsTo(User, {
        as: 'sender',
        foreignKey: {
            name: 'userId',
            allowNull: false,
        }
    });

    return Message;
};
