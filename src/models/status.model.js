module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Status', {

            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            value: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'statuses',
            timestamps: false
        })
};




