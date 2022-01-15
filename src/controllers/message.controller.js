const messageService = require('../services/message.service');

class MessageController {

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
