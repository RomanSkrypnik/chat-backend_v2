const messageService = require('../services/message.service');
const userService = require('../services/user.service');
const fileService = require('../services/file.service');
const friendService = require('../services/friend.service');
const SharpHelper = require('../helpers/sharp.helper');
const fs = require('fs');

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

    async sendTextMessage(req, res, next) {
        try {
            const {hash, text} = req.body;

            const newMessage = await messageService.createTextMessage(req.user, hash, text);

            return res.json(newMessage);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async sendMessageWithMedia(req, res, next) {
        try {
            const {hash, text} = req.body;

            for (const file of req.files) {
                await SharpHelper.compressPicture('./public/img/messages/' + file.filename);
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
