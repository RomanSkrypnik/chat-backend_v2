const messageService = require('../services/message.service');
const fileService = require('../services/file.service');
const friendService = require('../services/relation.service');

const UserRepository = require('../repositories/user.repository');
const RelationRepository = require('../repositories/relation.repository');
const MessageRepository = require('../repositories/message.repository');

const SharpHelper = require('../helpers/sharp.helper');

class MessageController {

    async messages(req, res, next) {
        try {
            const {hash, offset, limit} = req.body;

            const friend = await UserRepository.getUserByHash(hash);

            const {id} = await RelationRepository(req.user, friend);

            const messages = await MessageRepository.getMessages(id, offset, limit, 'DESC');

            return res.json(messages?.reverse());
        } catch (e) {
            next(e);
        }
    }

    async updateMessage(req, res, next) {
        try {
            const {messageId, text} = req.body;

            const message = await MessageRepository.getMessageByPk(messageId);

            const updatedMessage = await message.update({text});

            return res.json(updatedMessage);
        } catch (e) {
            next(e);
        }
    }

    async sendTextMessage(req, res, next) {
        try {
            const {hash, text} = req.body;

            const newMessage = await messageService.createTextMessage(req.user, hash, text);

            return res.json(newMessage);
        } catch (e) {
            next(e);
        }
    }

    async sendMessageWithMedia(req, res, next) {
        try {
            const {hash, text} = req.body;

            for (const file of req.files) {
                await SharpHelper.compressPicture('./public/messages/' + file.filename);
            }

            const {id} = await friendService.getFriendRelation(req.user, hash);

            const newMessages = await fileService.createMediaFiles(req.files, req.user.id, id, text);

            return res.json(newMessages);
        } catch (e) {
            next(e);
        }
    }

    async sendVoiceMessage(req, res, next) {
        try {


        } catch (e) {
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

    async stareMessage(req, res, next) {
        try {
            const {messageId} = req.body;

            const starred = await messageService.stareMessage(req.user, messageId);

            return res.json(starred);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new MessageController();
