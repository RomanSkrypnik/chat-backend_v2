const UserModel = require('../db/connection').users;
const StatusModel = require('../db/connection').statuses;
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const crypto = require('crypto');
const tokenService = require('./token.service');
const messageService = require('./message.service');
const friendService = require('./friend.service');
const UserDto = require('../dtos/user.dto');
const ApiException = require('../exceptions/api.exception');
const {Op} = require('sequelize');
const fs = require('fs');

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
            return await friendService.getFriendsWithMessages(currentUser);
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
            const messages = await messageService.getMessages(user, currentUser, 0, 40, 'DESC');
            return {friend: new UserDto(user), messages: messages?.reverse()};
        }));
    }

    async saveUserAvatar(hash, filename) {
        const currentUser = await this.getUserByHash(hash);

        if (currentUser.pictureUrl && fs.existsSync(currentUser.pictureUrl)) {
            fs.unlink('./public/img/' + currentUser.pictureUrl, (err) => {
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

        let fields = {...data};

        const {password} = data;

        if (password) {
            const password = await bcrypt.hash(password, 3);
            fields = {...fields, password};
        }

        await user.update(fields);

        return new UserDto(user);
    }

}

module.exports = new UserService();
