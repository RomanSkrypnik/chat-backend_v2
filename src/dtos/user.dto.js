const StatusDto = require('./status.dto');
module.exports = class UserDto {
    id;
    hash;
    name;
    status;
    isOnline;
    username;
    isActivated;
    pictureUrl;

    constructor(model) {
        this.id = model.id;
        this.hash = model.hash;
        this.name = model.name;
        this.isOnline = model.isOnline;
        this.username = model.username;
        this.pictureUrl = model.pictureUrl;
        this.isActivated = model.isActivated;
        this.status = model.status ? new StatusDto(model.status) : null;
    }

};
