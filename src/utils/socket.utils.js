const {authorize} = require('@thream/socketio-jwt');

const messageService = require('../services/message.service');
const statusService = require('../services/status.service');
const relationService = require('../services/relation.service');
const socketService = require('../services/socket.service');

const UserRepository = require('../repositories/user.repository');
const RelationRepository = require('../repositories/relation.repository');

const UserDto = require('../dtos/user.dto');

let sockets = [];

module.exports = (io) => {


    io.use(authorize({
        secret: process.env.JWT_ACCESS_SECRET,
    }));

    io.on('connection', async (currentSocket) => {
        console.log('new socket connection');
        const {hash} = currentSocket.decodedToken;
        const user = await UserRepository.getUserByHash(hash);

        await user.update({isOnline: true});
        sockets?.push({...currentSocket.decodedToken, id: currentSocket.id});

        currentSocket.on('send-text-message', async ({friend, message}) => {
            try {
                const friendSocket = socketService.findUser(sockets, friend.hash);

                const user = currentSocket.decodedToken;

                const {muted} = await RelationRepository.getRelation(user, friend);

                const isMuted = relationService.checkIfMuted(muted, friend.id);

                friendSocket && currentSocket.to(friendSocket.id).emit('new-text-message', {
                    friend: {...user, isMuted},
                    newMessage: message
                });

                currentSocket.emit('new-text-message', {friend, newMessage: message});
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('send-media-message', async ({friend, messages}) => {
            try {
                const friendSocket = socketService.findUser(sockets, friend.hash);

                const user = currentSocket.decodedToken;

                const {muted} = await RelationRepository.getRelation(user, friend);

                const isMuted = relationService.checkIfMuted(muted, friend.id);

                friendSocket && currentSocket.to(friendSocket.id).emit('new-media-message', {
                    friend: {...currentSocket.decodedToken, isMuted},
                    newMessages: messages
                });

                currentSocket.emit('new-media-message', {friend: friend, newMessages: messages});
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('change-status', async ({status}) => {
            try {
                await statusService.changeUserStatus(currentSocket.decodedToken, status.value);
                const friends = await relationService.getFriends(currentSocket.decodedToken);

                const onlineFriends = friends.filter(friend => friend.isOnline);
                const friendSockets = socketService.getFriendsSockets(sockets, onlineFriends);

                friendSockets.forEach(friendSockets => {
                    currentSocket.to(friendSockets.id).emit('new-status', {
                        status,
                        hash: currentSocket.decodedToken.hash
                    });
                });
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('read-message', async ({id, friendHash, currentHash}) => {
            try {
                await messageService.readMessage(id);

                const friendSocket = socketService.findUser(sockets, friendHash);

                friendSocket && currentSocket.to(friendSocket.id).emit('message-is-read', {id, hash: currentHash});
                currentSocket.emit('message-is-read', {id, hash: friendHash});
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('disconnect', async () => {
            console.log('disconnect');
            const {hash} = currentSocket.decodedToken;
            const user = await UserRepository.getUserByHash(hash);

            await user.update({isOnline: false});
            sockets = sockets.filter(socket => socket.hash !== hash);
        });

    });
};
