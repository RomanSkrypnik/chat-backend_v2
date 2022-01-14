class FriendController {

    friends(req, res, next) {
        try {
            const {email} = req.body;
        } catch(e) {
            next(e);
        }
    }

    removeFriend(req, res, next) {
        try {

        } catch(e) {
            next(e);
        }
    }


}

module.exports = new FriendController();