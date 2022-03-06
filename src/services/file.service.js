const FileModel = require('../db/connection').files;
const SharpHelper = require('../helpers/sharp.helper');
const MessageModel = require('../db/connection').messages;

class FileService {

    async createMediaFiles(files, messageId) {

        for (const file of files) {
            await SharpHelper.compressPicture('./public/img/messages/' + file.filename);
        }

        if (files.length > 5) {
            const nestedFiles = this._processMoreThanFiveFiles(files);
            const {userId, relationId} = await MessageModel.findByPk(messageId);

            let newMessageId = messageId;

            const insertedFiles = await Promise.all(nestedFiles.map(async fileArray => {
                const rows = this._getFormattedFiles(fileArray, newMessageId);

                const newMessage = await MessageModel.create({userId, relationId, text: ''});

                newMessageId = newMessage.id;

                return await FileModel.bulkCreate(rows);
            }));

            return insertedFiles.flat();
        } else {
            const rows = this._getFormattedFiles(files, messageId);
            return await FileModel.bulkCreate(rows);
        }
    }

    _processMoreThanFiveFiles(files) {
        let residual = files.length;
        let start = 0;
        const rows = [];

        while (residual >= 5) {
            rows.push(files.slice(start, start + 5));

            residual -= 5;
            start += 5;
        }

        if (residual >= 1) {
            rows.push(files.slice(start, start + residual))
        }

        return rows;
    }

    _getFormattedFiles(files, messageId) {
        return files.map(file => {
            return {
                originalName: file.originalname,
                uniqueName: file.filename,
                messageId
            }
        })
    }

}

module.exports = new FileService();
