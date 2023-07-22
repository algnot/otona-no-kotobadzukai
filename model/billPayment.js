const Base = require("./base");

module.exports = class BillPayment extends Base {
    name = null;
    number = null;
    isPromptpay = false;
    bill = null;

    constructor(id=null) {
        super("BillPayment", id);
        this.privateFields = [""];
    }
}