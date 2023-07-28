const { validatePayload } = require("../common/validater");
const Base = require("./base");
const UserBill = require("./userBill");
const BillItem = require("./billItems");
const BillPayment = require("./billPayment");
const User = require("./user");

module.exports = class Bill extends Base {
    owner = null;
    userBill = [];
    billItem = [];
    payment = [];
    totalTax = 0;
    totalAmount = 0;
    totalServiceCharge = 0;
    name = null;
    ref = null;

    constructor(id=null) {
        super("Bill", id);
        this.privateFields = ["id"];
    }

    validateBillPayload(payload, owner) {
        validatePayload(["name", "user", "items", "payment"], payload);
        const { user, items, payment } = payload;
        if((!user.uid && typeof user.uid != "boolean") && (!user.name || !user.email)) {
            throw new Error("User is not valid");
        }
        if(owner.uid == user.uid) {
            throw new Error("Can not create bill for yourself");
        }
        if(!Array.isArray(items) || items.length == 0) {
            throw new Error("Items is not valid");
        }
        items.forEach(item => {
            validatePayload(["name", "amount", "taxPercent", "serviceChargePercent"], item, "items");
        });
        validatePayload(["name", "number", "isPromptpay"], payment, "payment");
    }

    async processBillPayload(payload, owner) {
        const { name, user, items, payment } = payload;
        await this.create({
            name: name,
            owner: {
                connect: {
                    uid: owner.uid
                }
            },
            ref: this.randomUid()
        })

        await this._createUserBill(user);
        await this._createPayment(payment);

        let total = 0; 
        let totalServiceCharge = 0;
        let totalTax = 0;
        let totalAmount = 0;
        for(const item of items) {
            const createdBillItem = await this._createBillItem(item);
            total += createdBillItem.amount;
            totalServiceCharge += createdBillItem.totalServiceCharge;
            totalTax += createdBillItem.totalTax;
            totalAmount += createdBillItem.totalAmount;
        }
        await this.update({
            total: total,
            totalTax: totalTax,
            totalServiceCharge: totalServiceCharge,
            totalAmount: totalAmount
        })
        await this.get({
            billItem: true,
            userBill: true,
            owner: true,
            payment: true
        })
    }

    async _createBillItem(item) {
        const billItem = new BillItem();
        const tatalServiceCharge = item.amount * item.serviceChargePercent / 100;
        const totalTax = (item.amount + tatalServiceCharge) * item.taxPercent / 100;
        const totalAmount = item.amount + tatalServiceCharge + totalTax;
        await billItem.create({
            name: item.name,
            amount: item.amount,
            taxPercent: item.taxPercent,
            serviceChargePercent: item.serviceChargePercent,
            totalTax: totalTax,
            totalServiceCharge: tatalServiceCharge,
            totalAmount: totalAmount,
            bill: {
                connect: {
                    id: this.id
                }
            }
        });
        return billItem;
    }

    async _createUserBill(user) {
        const userBill = new UserBill();
        if(user.uid) {
            const userBillRelate = await new User().searchOne({uid: user.uid});
            await userBill.create({
                user: {
                    connect: {
                        uid: user.uid
                    },
                },
                name: userBillRelate.name,
                email: userBillRelate.email,
                bill: {
                    connect: {
                        id: this.id
                    }
                }
            })
        } else {
            await userBill.create({
                name: user.name,
                email: user.email,
                bill: {
                    connect: {
                        id: this.id
                    }
                }
            })
        }
        return userBill;
    }

    async _createPayment(paymentData) {
        const payment = new BillPayment();
        await payment.create({
            name: paymentData.name,
            number: paymentData.number,
            isPromptpay: paymentData.isPromptpay,
            bill: {
                connect: {
                    id: this.id
                }
            }
        })
        return payment;
    }

    async getResponse() {
        let res = await super.getResponse();
        if (res.owner) {
            res.owner.salt = undefined;
            res.owner.password = undefined;
            res.owner.googleAuthId = undefined;
            res.owner.id = undefined;
            res.owner.createdAt = undefined;
            res.owner.updatedAt = undefined;
        }
        if (res.userBill) {
            res.userBill.forEach(userBill => {
                userBill.billId = undefined;
                userBill.createdAt = undefined;
                userBill.updatedAt = undefined;
            })
        }
        if (res.billItem) {
            res.billItem.forEach(item => {
                item.billId = undefined;
                item.createdAt = undefined;
                item.updatedAt = undefined;
            })
        }
        if (res.payment) {
            res.payment.forEach(payment => {
                payment.billId = undefined;
                payment.createdAt = undefined;
                payment.updatedAt = undefined;
            })
        }
        return res;
    }

    randomUid() {
        const uid =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        return uid;
    }

    async getBillByOwner(owner, cursor=0, size=5) {
        const billClient = await this.client()
        let bills = await billClient.findMany({
            where: {
                owner: {
                    uid: owner.uid
                },
            },
            skip: parseInt(cursor),
            take: parseInt(size) + 1,
            include: {
                userBill: true,
                owner: true,
            }
        })

        bills = bills.map(bill => {
            bill.owner.salt = undefined;
            bill.owner.password = undefined;
            bill.owner.googleAuthId = undefined;
            return bill;
        })
                
        return {
            nextCursor: bills.length > size ?  bills[bills.length - 1].id : -1,
            data: bills.slice(0, size),
        };
    }

    async getBillByUser(user, cursor=0, size=5) {
        const billClient = await this.client()
        let bills = await billClient.findMany({
            where: {
                userBill: {
                    some: {
                        user: {
                            uid: user.uid
                        }
                    }
                }
            },
            skip: parseInt(cursor),
            take: parseInt(size) + 1,
            include: {
                userBill: true,
                owner: true,
            }
        })

        bills = bills.map(bill => {
            bill.owner.salt = undefined;
            bill.owner.password = undefined;
            bill.owner.googleAuthId = undefined;
            return bill;
        })

        return {
            nextCursor: bills.length > size ?  bills[bills.length - 1].id : -1,
            data: bills.slice(0, size),
        };
    }
}