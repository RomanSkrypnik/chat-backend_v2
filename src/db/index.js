const {sequelize, Sequelize} = require('./models');

const {DataTypes} = Sequelize;

module.exports = {
    Sequelize,
    sequelize,

    statuses: require('./models/status.model')(sequelize, DataTypes),
    users: require('./models/user.model')(sequelize, DataTypes),
    relations: require('./models/relation.model')(sequelize, DataTypes),
    messages: require('./models/message.model')(sequelize, DataTypes),
    files: require('./models/file.model')(sequelize, DataTypes),
    starred: require('./models/starred.model')(sequelize, DataTypes),
};
