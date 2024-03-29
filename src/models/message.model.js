module.exports = (sequelize, DataTypes) => {

    const Friend = require('./friend.model')(sequelize, DataTypes);
    const User = require('./user.model')(sequelize, DataTypes);
    const File = require('./file.model')(sequelize, DataTypes);

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

    Message.belongsTo(File, {
        as: 'file',
        foreignKey: {
            name: 'fileId',
            allowNull: true,
        }
    });

    return Message;
};
