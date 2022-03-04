const fileService = require('../services/file.service');

class FileController {

    async deleteMediaFiles(req, res, next) {
        try {
            const {messageId, fileNames} = req.body;

            const message = await fileService.deleteMediaFiles(messageId, fileNames);

            return res.json(message);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new FileController();
