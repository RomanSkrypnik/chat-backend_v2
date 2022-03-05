const {authorize} = require('@thream/socketio-jwt');
const messageService = require('../services/message.service');
const statusService = require('../services/status.service');
const userService = require('../services/user.service');
const friendService = require('../services/friend.service');
const SocketHelper = require('../helpers/socket.helper');
const UserDto = require('../dtos/user.dto');

let sockets = [];

module.exports = (io) => {


    io.use(authorize({
        secret: process.env.JWT_ACCESS_SECRET,
    }));

    io.on('connection', async (currentSocket) => {
        console.log('new socket connection');
        const {hash} = currentSocket.decodedToken;
        const user = await userService.getUserByHash(hash);

        await user.update({isOnline: true});
        sockets?.push({...currentSocket.decodedToken, id: currentSocket.id});

        currentSocket.on('send-message', async ({friendHash, messageId}) => {
            try {
                const newMessage = await messageService.getMessageById(messageId);

                const friendSocket = SocketHelper.findUser(sockets, friendHash);

                const friend = await userService.getUserByHash(friendHash);
                const friendDto = new UserDto(friend);

                friendSocket && currentSocket.to(friendSocket.id).emit('new-message', {friend: currentSocket.decodedToken, newMessage});
                currentSocket.emit('new-message', {friend: friendDto, newMessage});
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('change-status', async ({status}) => {
            try {
                await statusService.changeUserStatus(currentSocket.decodedToken, status);
                const friends = await friendService.getFriends(currentSocket.decodedToken);

                const onlineFriends = friends.filter(friend => friend.isOnline);
                const friendSockets = SocketHelper.getFriendsSockets(sockets, onlineFriends);

                friendSockets.forEach(friendSockets => {
                    currentSocket.to(friendSockets.id).emit('new-status', {status, hash: currentSocket.decodedToken.hash});
                });
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('read-message', async ({id, friendHash, currentHash}) => {
            try {
                await messageService.readMessage(id);

                const friendSocket = SocketHelper.findUser(sockets, friendHash);

                friendSocket && currentSocket.to(friendSocket.id).emit('message-is-read', {id, hash: currentHash});
                currentSocket.emit('message-is-read', {id, hash: friendHash});
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('disconnect', async () => {
            console.log('disconnect');
            const {hash} = currentSocket.decodedToken;
            const user = await userService.getUserByHash(hash);

            await user.update({isOnline: false});
            sockets = sockets.filter(socket => socket.hash !== hash);
        });

    });
};
