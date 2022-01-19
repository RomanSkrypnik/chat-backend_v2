module.exports = (sequelize, DataTypes) => {
    const Status = require('./status.model')(sequelize, DataTypes);

    const User =  sequelize.define('User', {

            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            username: {
                type: DataTypes.STRING,
                allowNull: false
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            hash: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            pictureUrl: {
                type: DataTypes.STRING,
            },

            activationLink: {
                type: DataTypes.STRING,
            },

            isActivated: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            isOnline: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            }
        },
        {
            tableName: 'users',
        });

    User.belongsTo(Status, {
        as: 'status',
        foreignKey: {
            name:'statusId',
            defaultValue: 1,
            allowNull: false
        }
    });

    return User;
};
