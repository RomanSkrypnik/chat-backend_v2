const fs = require('fs');

module.exports = class FileHelper {

    static async deleteFile(path) {
        await fs.unlink(path, () => {});
    }

};
