const { Sequelize, DataTypes } = require('sequelize');

const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dialect = process.env.DB_CONNECTION;
const logging = process.env.DB_LOGGING === "true";

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    logging
});



module.exports = {
    Sequelize,
    sequelize,
    statuses: require('../models/status.model')(sequelize, DataTypes),
    users: require('../models/user.model')(sequelize, DataTypes),
};