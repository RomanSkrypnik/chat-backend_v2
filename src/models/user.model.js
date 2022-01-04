module.exports = (sequelize, DataTypes) => {
    const Status = require('./status.model')(sequelize, DataTypes);

    return sequelize.define('User', {

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

            statusId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                references: {
                    model: Status,
                    key: 'id',
                },
                defaultValue: 1,
            },

        },
        {
            tableName: 'users',
        })
};