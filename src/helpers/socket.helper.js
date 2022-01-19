module.exports = class SocketHelper {

    static findUser(sockets, hash) {
        return sockets.find(storedSocket => storedSocket.hash === hash);
    }


}