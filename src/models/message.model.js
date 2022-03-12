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
            },

            starredBySender: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            starredByReceiver: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            }
        },
        {
            tableName: 'messages',
            timestamps: true,
        }
    );

    const File = sequelize.define('File', {

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
    });

    const Starred = sequelize.define('Starred', {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
        },
        {
            tableName: 'starredMessages',
            timestamps: true,
        }
    );

    Message.hasMany(File, {
        as: 'files',
        foreignKey: {
            name: 'messageId',
            allowNull: false,
        }
    });

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

    File.belongsTo(Message, {
        as: 'message',
        foreignKey: {
            name: 'messageId',
            allowNull: false,
        }
    });

    Starred.belongsTo(Message, {
        as: 'starred',
        foreignKey: {
            name: 'messageId',
            allowNull: false,
        }
    });

    Starred.belongsTo(User, {
        as: 'user',
        foreignKey: {
            name: 'userId',
            allowNull: false,
        }
    });

    return {Message, File, Starred};
};
