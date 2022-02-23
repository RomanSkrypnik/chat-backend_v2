const friendService = require('../services/friend.service');
const userService = require('../services/user.service');
const UserDto = require('../dtos/user.dto');

class FriendController {

    async friends(req, res, next) {
        try {
            const friends = await friendService.getFriendsWithMessages(req.user);

            return res.json(friends);
        } catch (e) {
            next(e);
        }
    }

    async searchFriendByHash(req, res, next) {
        try {
            const {hash} = req.body;

            const user = await userService.getUserByHash(hash);
            const userDto = new UserDto(user);

            return res.json(userDto);
        } catch (e) {
            next(e);
        }
    }

    async removeFriend(req, res, next) {
        try {
            const {hash} = req.body;

            const user = await friendService.removeFriend(req.user, hash);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new FriendController();
