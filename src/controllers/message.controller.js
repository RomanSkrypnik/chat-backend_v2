const messageService = require('../services/message.service');
const userService = require('../services/user.service');

class MessageController {

    async messages(req, res, next) {
        try {
            const {hash, offset, limit} = req.body;
            const friend = await userService.getUserByHash(hash);
            const messages = await messageService.getMessages(req.user, friend, offset, limit, 'DESC');
            return res.json(messages.reverse());
        } catch(e) {
            console.log(e);
            next(e);
        }
    }

    async sendMessage(req, res, next) {
        try {
            const {hash, message} = req.body;
            const newMessage = await messageService.createMessage(req.user, hash, message);
            return res.json(newMessage);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

}

module.exports = new MessageController();
