const Base = require("./base");
const Config = require('@taro-common/common-config');

const config = new Config();

module.exports = class PaymentDetail extends Base {
    name = null;
    number = null;
    isPromptpay = false;
    user = null;
    uid = null;
    QRCodeLink = null;

    constructor(id = null) {
        super("PaymentDetail", id);
        this.privateFields = ["uid"];
        this.computeFields = [{
            name: "QRCodeLink",
            compute: this.getQrCode
        }];
    }

    async getQrCode(self, amount=0) {
        if(!self.number) {
            return null
        }
        if(!self.isPromptpay) {
            return null
        }
        return `${await config.get("promptpay_api_url")}/api?amount=${amount}&id=${self.number}`;
    }

    async getResponse() {
        const res = await super.getResponse();
        res.user.salt = undefined;
        res.user.password = undefined;
        return res;
    }

}