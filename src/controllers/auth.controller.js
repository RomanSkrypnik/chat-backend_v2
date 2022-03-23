const UserRepository = require('../repositories/user.repository');

const {validationResult} = require('express-validator');

const userService = require('../services/user.service');

const ApiException = require('../exceptions/api.exception');

class AuthController {

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

            res.cookie('refreshToken', userData.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {hash} = req.user;
            const user = await UserRepository.getUserByHash(hash);

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
            const {refreshToken} = req.cookies;

            const userData = await userService.refresh(refreshToken);

            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async checkPasswordIdentity(req, res, next) {
        try {
            const {password} = req.body;
            const {hash} = req.user;

            const passwordMatches = await userService.comparePasswords(hash, password);

            res.json({success: passwordMatches});
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController();
