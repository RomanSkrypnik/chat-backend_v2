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

        currentSocket.on('send-message', async ({hash, message}) => {
            try {
                const user = currentSocket.decodedToken;
                const newMessage = await messageService.createMessage(user, hash, message);

                const sender = await userService.getUserByHash(user.hash);
                const receiver = await userService.getUserByHash(hash);

                const senderDto = new UserDto(sender);
                const receiverDto = new UserDto(receiver);

                const friendSocket = SocketHelper.findUser(sockets, hash);

                friendSocket && currentSocket.to(friendSocket.id).emit('new-message', {friend: senderDto, lastMessage: newMessage});
                currentSocket.emit('new-message', {friend: receiverDto, lastMessage: newMessage});
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

        currentSocket.on('read-message', async ({id, hash}) => {
            try {
                await messageService.readMessage(id);

                const friendSocket = SocketHelper.findUser(sockets, hash);

                friendSocket && currentSocket.to(friendSocket.id).emit('message-is-read', {id, hash});
                currentSocket.emit('message-is-read', {id, hash: friendSocket.decodedToken.hash});
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
