const FileModel = require('../db/connection').files;
const SharpHelper = require('../helpers/sharp.helper');

class FileService {

    async createMediaFiles(files, messageId) {

        const rows = files.map(file => {
            return {
                originalName: file.originalname,
                uniqueName: file.filename,
                messageId
            }
        });

        for (const file of files) {
            await SharpHelper.compressPicture('./public/img/messages/' + file.filename);
        }

        return await FileModel.bulkCreate(rows);
    }

}

module.exports = new FileService();
