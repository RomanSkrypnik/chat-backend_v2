const StatusDto = require('./status.dto');
module.exports = class UserDto {
    id;
    hash;
    status;
    username;
    isOnline;
    isActivated;

    constructor(model) {
        this.id = model.id;
        this.hash = model.hash;
        this.username = model.username;
        this.isActivated = model.isActivated;
        this.isOnline = model.isOnline;
        this.status = model.status ? new StatusDto(model.status) : null;
    }

};
