const authRoutes = require('./auth.route');
const statusRoutes = require('./status.route');
const friendRoutes = require('./friend.route');
const followerRoutes = require('./follower.route');
const messageRoutes = require('./message.route');

module.exports = [
    authRoutes,
    statusRoutes,
    friendRoutes,
    followerRoutes,
    messageRoutes,
];
