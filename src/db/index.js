const db = require('./models');
const {Sequelize, sequelize} = db;

module.exports = {
    Sequelize,
    sequelize,

    statuses: db.statuses,
    users: db.users,
    relations: db.relations,
    messages: db.messages,
    files: db.files,
    starred: db.starred,
};
