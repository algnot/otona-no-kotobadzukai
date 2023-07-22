const Base = require("./base");

module.exports = class UserBill extends Base {
    user = null;
    bill = null;
    name = null;
    email = null;

    constructor(id=null) {
        super("UserBill", id);
        this.privateFields = [""];
    }
}