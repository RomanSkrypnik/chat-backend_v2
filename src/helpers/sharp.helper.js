const sharp = require('sharp');

module.exports = class SharpHelper {

    static compressPicture(path, resize) {
        sharp(path)
            .resize(resize)
            .toBuffer();
    }
}
