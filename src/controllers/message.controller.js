const messageService = require('../services/message.service');
const userService = require('../services/user.service');
const fileService = require('../services/file.service');

class MessageController {

    async messages(req, res, next) {
        try {
            const {hash, offset, limit} = req.body;
            const friend = await userService.getUserByHash(hash);

            const messages = await messageService.getMessages(req.user, friend, offset, limit, 'DESC');

            return res.json(messages?.reverse());
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async sendMessage(req, res, next) {
        try {
            const {hash, text} = req.body;

            const newMessage = await messageService.createMessage(req.user, hash, text);

            if (req.files && req.files.length > 0) {
                newMessage.files = await fileService.createMediaFiles(req.files, newMessage.id);
            }

            return res.json(newMessage);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async readMessage(req, res, next) {
        try {
            const {id} = req.body;

            await messageService.readMessage(id);

            return res.json({success: true, message: 'Message is read'});
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new MessageController();
