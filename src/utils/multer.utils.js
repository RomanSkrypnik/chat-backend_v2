const multer = require('multer');

const filename = (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
};

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/avatars')
    },
    filename,
});

const messageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/messages')
    },
    filename
});

module.exports = {avatarStorage, messageStorage};
