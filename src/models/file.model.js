module.exports = (sequelize, DataTypes) => {

    return sequelize.define('File', {

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

};
