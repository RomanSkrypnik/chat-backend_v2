const StatusDto = require('./status.dto');
module.exports = class UserDto {
    id;
    status;
    username;
    isActivated;

    constructor(model) {
        this.id = model.id;
        this.hash = model.hash;
        this.username = model.username;
        this.isActivated = model.isActivated;
        this.status = model.status ? new StatusDto(model.status) : null;
    }

};
