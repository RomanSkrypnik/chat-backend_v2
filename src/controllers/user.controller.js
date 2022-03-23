const userService = require('../services/user.service');

const SharpHelper = require('../helpers/sharp.helper');


class UserController {

    async usersBySearch(req, res, next) {
        try {
            const {search} = req.body;

            const users = await userService.getUsersBySearch(req.user, search);

            return res.json(users);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async uploadPhoto(req, res, next) {
        try {
            const {filename, path} = req.file;

            await userService.saveUserAvatar(req.user.hash, filename);
            await SharpHelper.compressPicture(path);

            return res.json({filename});
        } catch (e) {
            next(e);
        }
    }

    async changePersonalInfo(req, res, next) {
        try {
            const {data} = req.body;
            const {hash} = req.user;

            const user = await userService.updatePersonalInfo(hash, data);

            res.json(user);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

}

module.exports = new UserController();
