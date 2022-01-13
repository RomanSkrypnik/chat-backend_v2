module.exports = class StatusDto {
    label;
    className;
    value;

    constructor(model) {
        this.label = model.name;
        this.className = model.name;
        this.value = model.value;
    }
}