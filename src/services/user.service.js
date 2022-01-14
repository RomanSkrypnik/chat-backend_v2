const UserModel = require('../db/connection').users;
const StatusModel = require('../db/connection').statuses;
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokenService = require('./token.service');
const UserDto = require('../dtos/user.dto');
const ApiException = require('../exceptions/api.exception');

class UserService {

    async registration(data) {
        const candidate = await this.getUserByEmail(data.email);

        if (candidate) {
            throw ApiException.BadRequest(`User with such email already exists`);
        }

        const password = await bcrypt.hash(data.password, 3);
        const activationLink = uuid.v4();
        await UserModel.create({...data, password, activationLink});

        // await mailService.sendActivationMail(data.email, `${process.env.API_URL}/api/activate/${activationLink}`);
        return {message: "User is successfully registered"};
    }

    async login(data) {
        const user = await this.getUserByEmail(data.email);

        if (!user) {
            throw ApiException.BadRequest('User is not found');
        }

        const isPassEquals = await bcrypt.compare(data.password, user.password);

        if (!isPassEquals) {
            throw ApiException.BadRequest('Wrong password');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        return {tokens, user: userDto};
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({where: {activationLink}});

        if (!user) {
            throw ApiException.BadRequest('Incorrect activation link');
        }

        user.isActivated = true;
        await user.save();
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiException.UnathorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);

        if (!userData) {
            throw ApiException.UnathorizedError();
        }

        const user = await this.getUserByEmail(userData.email);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        return {...tokens, user: userDto};
    }

    async getUsers() {
        return await UserModel.findAll();
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({
            where: {email},
            include: {
                model: StatusModel,
                as: 'status'
            }
        });
    }

}

module.exports = new UserService();
