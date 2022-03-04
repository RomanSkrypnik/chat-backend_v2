const FileModel = require('../db/connection').files;
const MessageModel = require('../db/connection').messages;
const ApiExceptions = require('../exceptions/api.exception');
const {Op} = require('sequelize');
const FileHelper = require('../helpers/file.helper');


class FileService {

    async deleteMediaFiles(messageId, fileNames) {

        await FileModel.destroy({
                where: {
                    uniqueName: {
                        [Op.or]: fileNames
                    }
                }
            }
        );


        for (const fileName of fileNames) {
            await FileHelper.deleteFile('./public/img/messages/' + fileName);
        }

        const message = await MessageModel.findOne({
                where: {
                    id: messageId
                },
                include: {
                    model: FileModel,
                    as: 'files'
                }
            }
        );

        if (!message) {
            return ApiExceptions.BadRequest('Message is not found');
        }

        if (message.text === '' && message.files.length === 0) {
            await message.destroy();
        }

        return message;
    }

}

module.exports = new FileService();
