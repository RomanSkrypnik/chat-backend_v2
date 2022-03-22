const fs = require('fs');

class FSService {
    avatarsUrl = './public/img/avatars/';

    deleteOldAvatar(pictureUrl) {
        const url = this.avatarsUrl + pictureUrl;

        fs.unlink(url, (err) => {
            if (err) throw err;

            console.log('File is deleted!')
        });
    }

}

module.exports = new FSService();
