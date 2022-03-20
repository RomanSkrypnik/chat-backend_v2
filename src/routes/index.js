const authRoutes = require('./auth.route');
const statusRoutes = require('./status.route');
const friendRoutes = require('./relation.route');
const messageRoutes = require('./message.route');

module.exports = [
    authRoutes,
    statusRoutes,
    friendRoutes,
    messageRoutes,
];
