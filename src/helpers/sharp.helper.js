const sharp = require('sharp');
const fs = require('fs');
sharp.cache(false);

module.exports = class SharpHelper {

    static async compressPicture(path) {
        let {width, height} = await SharpHelper.getMetaData(path);

        const aspectRadio = width / height;

        if (width > height) {
            width = 1280;
            height = +(width / aspectRadio).toFixed(0);
        } else {
            height = 1280;
            width = +(height / aspectRadio).toFixed(0);
        }


        await sharp(path)
            .resize(width, height,)
            .withMetadata()
            .toBuffer((err, buffer) => fs.writeFile(path, buffer, () => {} ));
    }

    static async getMetaData(path) {
        return await sharp(path).metadata();
    }
};
