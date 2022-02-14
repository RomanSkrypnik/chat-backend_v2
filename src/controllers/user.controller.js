const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const ApiException = require('../exceptions/api.exception');

class UserController {

    async register(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiException.BadRequest('Validation error', errors.array()))
            }

            const formData = req.body;
            const response = await userService.registration(formData);
            return res.json(response);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const formData = req.body;
            const userData = await userService.login(formData);
            res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { hash } = req.user;
            const user = await userService.getUserByHash(hash);
            await user.update({isOnline: false});
            res.clearCookie('refreshToken');
            return res.json({message: 'Logged out'});
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async users(req, res, next) {
        try {
            const users = await userService.getUsers();
            return res.json(users);
        } catch(e) {
            next(e);
        }
    }

    async usersBySearch(req, res, next) {
        try {
            const {search} = req.body;
            const users = await userService.getUsersBySearch(req.user, search);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async uploadPhoto(req, res, next) {
        try {
            return res.json({message: 'picture is loaded!'});
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new UserController();
