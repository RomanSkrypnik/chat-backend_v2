const authRoutes = require('./auth.route');
const statusRoutes = require('./status.route');
const friendRoutes = require('./friend.route');
const messageRoutes = require('./message.route');
const fileRoutes = require('./file.route');

module.exports = [
    authRoutes,
    statusRoutes,
    friendRoutes,
    messageRoutes,
    fileRoutes,
];
