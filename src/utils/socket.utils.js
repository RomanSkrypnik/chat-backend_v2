const {authorize} = require('@thream/socketio-jwt');
const messageService = require('../services/message.service');
const statusService = require('../services/status.service');
const userService = require('../services/user.service');
const friendService = require('../services/friend.service');
const SocketHelper = require('../helpers/socket.helper');

let sockets = [];

module.exports = (io) => {

    io.use(authorize({
        secret: process.env.JWT_ACCESS_SECRET,
    }));

    io.on('connection', async (currentSocket) => {
        console.log('new socket connection');
        const {hash} = currentSocket.decodedToken;
        const user = await userService.getUserByHash(hash);

        user.update({isOnline: true});
        sockets?.push({...currentSocket.decodedToken, id: currentSocket.id});

        currentSocket.on('send-message', async ({hash, message}) => {
            try {
                const newMessage = await messageService.createMessage(currentSocket.decodedToken, hash, message);
                const friendSocket = SocketHelper.findUser(sockets, hash);

                friendSocket && currentSocket.to(friendSocket.id).emit('new-message', newMessage);
                currentSocket.emit('new-message', newMessage);
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('change-status', async ({status}) => {
            try {
                await statusService.changeUserStatus(currentSocket.decodedToken, status);
                const friends = await friendService.getFriends(currentSocket.decodedToken);

                const onlineFriends = friends.filter(friend => friend.isOnline);
                const friendSockets = sockets
                    .map(socket => onlineFriends.every(onlineFriend => onlineFriend.hash === socket.hash) && socket)
                    .filter(onlineFriends => onlineFriends);

                friendSockets.forEach(friendSockets => {
                    currentSocket.to(friendSockets.id).emit('new-status', {status, hash: currentSocket.decodedToken.hash});
                });
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('disconnect', async () => {
            const {hash} = currentSocket.decodedToken;
            const user = await userService.getUserByHash(hash);

            user.update({isOnline: false});
            sockets = sockets.length > 0 && sockets.filter(socket => socket.hash !== hash);
        });

    });
}
