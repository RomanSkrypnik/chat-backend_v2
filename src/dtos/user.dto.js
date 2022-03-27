const StatusDto = require('./status.dto');
module.exports = class UserDto {
    id;
    hash;
    name;
    email;
    status;
    isOnline;
    username;
    isActivated;
    pictureUrl;
    isMuted;
    isBlocked;
    isBlockedByMe;

    constructor(model) {
        this.id = model.id;
        this.hash = model.hash;
        this.name = model.name;
        this.email = model.email;
        this.isOnline = model.isOnline;
        this.username = model.username;
        this.pictureUrl = model.pictureUrl;
        this.isActivated = model.isActivated;
        this.status = model.status ? new StatusDto(model.status) : null;
        this.isMuted = model.isMuted ?? false;
        this.isBlocked = model.isBlocked ?? false;
        this.isBlockedByMe = model.isBlockedByMe ?? false;
    }

};
