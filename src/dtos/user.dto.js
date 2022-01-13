const StatusDto = require('./status.dto');
module.exports = class UserDto {
    id;
    email;
    status;
    username;
    isActivated;

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.status = new StatusDto(model.status);
        this.username = model.username;
        this.isActivated = model.isActivated;
    }

};