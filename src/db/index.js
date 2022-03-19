const {sequelize, Sequelize} = require('./models');

const {DataTypes} = Sequelize;

module.exports = {
    Sequelize,
    sequelize,
    statuses: require('./models/status.model')(sequelize, DataTypes),
};
