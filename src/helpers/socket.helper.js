module.exports = class SocketHelper {

    static findUser(sockets, hash) {
        return sockets.find(storedSocket => storedSocket.hash === hash);
    }

    static getFriendsSockets(sockets, friends) {
        return sockets
            .map(socket => {
                    return friends.every(friends => friends.hash === socket.hash) && socket;
                }
            )
            .filter(friends => friends);
    }

};
