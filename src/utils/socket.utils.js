const {authorize} = require('@thream/socketio-jwt');
const messageService = require('../services/message.service');

let sockets = [];

module.exports = (io) => {

    io.use(authorize({
        secret: process.env.JWT_ACCESS_SECRET,
    }));

    io.on('connection', async (currentSocket) => {
        console.log('new socket connection');
        sockets.push({...currentSocket.decodedToken, id: currentSocket.id});

        currentSocket.on('send-message', async ({hash, message}) => {
            try {
                const newMessage = await messageService.createMessage(currentSocket.decodedToken, hash, message);
                const friendSocket = sockets.find(storedSocket => storedSocket.hash === hash);
                currentSocket.to(friendSocket.id).emit('new-message', newMessage);
            } catch (e) {
                console.log(e);
            }
        });

        currentSocket.on('disconnect', () => {
            sockets = sockets.length > 0 && sockets.filter(socket => {
                return socket.hash !== currentSocket.decodedToken.hash;
            });
        });

    });
}