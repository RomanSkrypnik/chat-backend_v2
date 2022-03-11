const multer = require('multer');

const filename = (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
};

const voiceFileName = (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let ext = '.ogg';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
};

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/avatars');
    },
    filename,
});

const messageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/messages');
    },
    filename
});

const voiceStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/voices');
    },
    filename: voiceFileName
});

module.exports = {avatarStorage, messageStorage, voiceStorage};
