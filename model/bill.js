const Base = require("./base");

module.exports = class Bill extends Base {
    owner = null;
    userBill = [];
    billItems = [];
    payment = [];
    totalTax = 0;
    totalAmount = 0;
    totalServiceCharge = 0;
    name = null;

    constructor(id=null) {
        super("Bill", id);
        this.privateFields = [""];
    }
}