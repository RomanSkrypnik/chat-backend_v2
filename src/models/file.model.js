module.exports = (sequelize, DataTypes) => {

    const Message = require('./message.model')(sequelize, DataTypes);

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

    File.belongsTo(Message,{
        as: 'files',
        foreignKey: {
            name: 'messageId',
            allowNull: false,
        }
    });

    return File
};
