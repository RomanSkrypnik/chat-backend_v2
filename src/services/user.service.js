const UserModel = require('../db').users;

const tokenService = require('./token.service');
const relationService = require('./relation.service');
const fsService = require('./fs.service');

const UserRepository = require('../repositories/user.repository');
const MessageRepository = require('../repositories/message.repository');

const UserDto = require('../dtos/user.dto');

const ApiException = require('../exceptions/api.exception');

const bcrypt = require('bcrypt');
const uuid = require('uuid');
const crypto = require('crypto');

class UserService {

    async registration(data) {
        const candidate = await UserRepository.getUserByEmail(data.email);

        if (candidate) {
            throw ApiException.BadRequest(`User with such email already exists`);
        }

        const password = await bcrypt.hash(data.password, 3);

        const activationLink = uuid.v4();

        const hash = crypto.randomBytes(20).toString('hex');

        await UserRepository.create({...data, password, hash, activationLink});

        // await mailService.sendActivationMail(data.email, `${process.env.API_URL}/api/activate/${activationLink}`);
        return {message: "User is successfully registered"};
    }

    async login(data) {
        const user = await UserRepository.getUserByEmail(data.email);

        if (!user) {
            throw ApiException.BadRequest('User is not found');
        }

        const isPassEquals = await bcrypt.compare(data.password, user.password);

        if (!isPassEquals) {
            throw ApiException.BadRequest('Wrong password');
        }

        await user.update({isOnline: true});

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

        const user = await UserRepository.getUserByHash(userData.hash);

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({...userDto});

        return {...tokens, user: userDto};
    }

    async getUsersBySearch(currentUser, search) {

        if (!search) {
            return await relationService.getFriendsWithMessages(currentUser);
        }

        const users = await UserRepository.getUsersBySearch(search, currentUser);

        return Promise.all(users.map(async user => {
            const messages = await MessageRepository.getMessages(user, currentUser, 0, 40, 'DESC');
            return {friend: new UserDto(user), messages};
        }));
    }

    async saveUserAvatar(hash, filename) {
        const user = await UserRepository.getUserByHash(hash);

        if (user.pictureUrl) {
            await fsService.deleteOldAvatar(user.pictureUrl);
        }

        await user.update({pictureUrl: filename});
    }

    async comparePasswords(hash, enteredPassword) {
        const {password} = await UserRepository.getUserByHash(hash);

        return await bcrypt.compare(enteredPassword, password);
    }

    async updatePersonalInfo(hash, data) {
        const user = await UserRepository.getUserByHash(hash);

        let fields = data;

        const {newPassword} = fields;

        if (newPassword) {
            const password = await bcrypt.hash(newPassword, 3);
            fields = {...fields, password};
        }

        const updatedUser = await user.update(fields);

        return new UserDto(updatedUser);
    }

}

module.exports = new UserService();
