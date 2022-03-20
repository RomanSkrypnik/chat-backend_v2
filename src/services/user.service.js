const UserModel = require('../db').users;
const StatusModel = require('../db').statuses;

const tokenService = require('./token.service');
const messageService = require('./message.service');
const relationService = require('./relation.service');

const UserDto = require('../dtos/user.dto');

const ApiException = require('../exceptions/api.exception');

const fs = require('fs');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const crypto = require('crypto');
const {Op} = require('sequelize');

class UserService {

    async registration(data) {
        const candidate = await UserModel.findOne({where: {email: data.email},});

        if (candidate) {
            throw ApiException.BadRequest(`User with such email already exists`);
        }

        const password = await bcrypt.hash(data.password, 3);

        const activationLink = uuid.v4();

        const hash = crypto.randomBytes(20).toString('hex');

        await UserModel.create({...data, password, hash, activationLink});

        // await mailService.sendActivationMail(data.email, `${process.env.API_URL}/api/activate/${activationLink}`);
        return {message: "User is successfully registered"};
    }

    async login(data) {
        const user = await UserModel.findOne(
            {
                where: {email: data.email},
                include: {
                    model: StatusModel,
                    as: 'status'
                }
            });

        if (!user) {
            throw ApiException.BadRequest('User is not found');
        }

        const isPassEquals = await bcrypt.compare(data.password, user.password);

        if (!isPassEquals) {
            throw ApiException.BadRequest('Wrong password');
        }

        user.update({isOnline: true});
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

        const user = await this.getUserByHash(userData.hash);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        return {...tokens, user: userDto};
    }

    async getUsers() {
        return await UserModel.findAll();
    }

    async getUserByHash(hash) {
        const user = await UserModel.findOne({
            where: {hash},
            include: {
                model: StatusModel,
                as: 'status'
            }
        });

        if (!user) {
            throw ApiException.BadRequest('User is not found');
        }

        return user;
    }

    async getUsersBySearch(currentUser, search) {

        if (!search) {
            return await relationService.getFriendsWithMessages(currentUser);
        }

        const field = search.startsWith('@') ? 'username' : 'name';

        const users = await UserModel.findAll({
            where: {
                [field]: {
                    [Op.startsWith]: search,
                    [Op.not]: currentUser[field]
                },
            },
            include: {
                model: StatusModel,
                as: 'status'
            }
        });

        return Promise.all(users.map(async user => {
            const userMessages = await messageService.getMessages(user, currentUser, 0, 40, 'DESC');

            const messages = userMessages ? userMessages.reverse() : [];

            return {friend: new UserDto(user), messages};
        }));
    }

    async saveUserAvatar(hash, filename) {
        const currentUser = await this.getUserByHash(hash);

        const url = './public/img/avatars/' + currentUser.pictureUrl;

        if (currentUser.pictureUrl && fs.existsSync(url)) {
            fs.unlink(url, (err) => {
                if (err) throw err;

                console.log('File is deleted!')
            });
        }

        await currentUser.update({pictureUrl: filename});
    }

    async comparePasswords(hash, enteredPassword) {
        const {password} = await this.getUserByHash(hash);

        return await bcrypt.compare(enteredPassword, password);
    }

    async updatePersonalInfo(hash, data) {
        const user = await this.getUserByHash(hash);

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
