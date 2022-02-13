const ApiException = require('../exceptions/api.exception');
const tokenService = require('../services/token.service');
const userService = require('../services/user.service');

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(ApiException.UnathorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];

        if (!accessToken) {
            return next(ApiException.UnathorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData) {
            return next(ApiException.UnathorizedError());
        }

        const user = await userService.getUserByHash(userData.hash);

        if (!user) {
            return next(ApiException.UnathorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiException.UnathorizedError());
    }

};
