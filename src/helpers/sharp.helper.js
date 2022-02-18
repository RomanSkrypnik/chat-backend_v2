const sharp = require('sharp');

module.exports = class SharpHelper {

    static compressPicture(path, resize) {
        sharp(path)
            .resize(resize)
            .toFile(path, (err, info) => {
                if (!err) {
                    console.log(info);
                } else {
                    console.log(err);
                }
            });
    }
}