const Base = require("./base");
const Config = require("@taro-common/common-config");

const config = new Config();

module.exports = class PaymentDetail extends Base {
  name = null;
  number = null;
  isPromptpay = false;
  user = null;
  uid = null;
  QRCodeLink = null;
  ref = null;

  constructor(id = null) {
    super("PaymentDetail", id);
    this.privateFields = ["uid"];
    this.computeFields = [
      {
        name: "QRCodeLink",
        compute: this.getQrCode,
      },
    ];
  }

  async getQrCode(self, amount = 0) {
    if (!self.number) {
      return null;
    }
    if (!self.isPromptpay) {
      return null;
    }
    return `${await config.get("promptpay_api_url")}/api?&id=${
      self.number
    }&amount=${amount}`;
  }

  async getResponse() {
    let res = await super.getResponse();
    if (res.user) {
      res.user.salt = undefined;
      res.user.password = undefined;
    }
    return res;
  }

  randomRef() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
};
