const db = require('./models');
const {Sequelize, sequelize} = db;

module.exports = {
    Sequelize,
    sequelize,

    statuses: db.Status,
    users: db.User,
    relations: db.Relation,
    messages: db.Message,
    files: db.File,
    starred: db.Starred,
    muted: db.Muted,
    blocked: db.Blocked,
};
