const FileModel = require('../db/connection').files;
const MessageModel = require('../db/connection').messages;
const ApiExceptions = require('../exceptions/api.exception');

class FileService {

    async deleteMediaFiles(messageId, fileNames) {
        const message = await MessageModel.findByPk(messageId);

        if (!message) {
            return ApiExceptions.BadRequest('Message is not found');
        }


    }

}

module.exports = new FileService();
