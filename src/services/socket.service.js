class SocketService {

    findUser(sockets, hash) {
        return sockets.find(storedSocket => storedSocket.hash === hash);
    }

    getFriendsSockets(sockets, friends) {
        return sockets
            .map(socket => {
                    return friends.every(friends => friends.hash === socket.hash) && socket;
                }
            )
            .filter(friends => friends);
    }

}

module.exports = new SocketService();
