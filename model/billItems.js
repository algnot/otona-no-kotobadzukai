const Base = require("./base");

module.exports = class BillItem extends Base {
    bill = null;
    amount = 0;
    taxPercent = 0;
    serviceChargePercent = 0;
    totalAmount = 0;
    name = null;
    unitAmount = 0;
    quantity = 0;

    constructor(id=null) {
        super("BillItem", id);
        this.privateFields = [""];
    }
}