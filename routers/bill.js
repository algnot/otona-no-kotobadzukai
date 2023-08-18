const express = require('express');
const Logger = require('@taro-common/common-logger');
const router = express.Router();
const { getUserFromHeader } = require('../common/routerHelper');
const logger = new Logger();
const Bill = require('../model/bill');

router.get("/my-bill-owner", async (req, res) => {
    try {
        const owner = await getUserFromHeader(req);
        let {cursor, size} = req.query;

        cursor = cursor || 0;
        size = size || 5;
        
        if (isNaN(cursor) || isNaN(size)) {
            throw new Error("Cursor and size must be number");
        }

        const bill = new Bill();
        const bills = await bill.getBillByOwner(owner, cursor, size);

        res.send(bills);
    } catch (error) {
        logger.error(`❌ [Get Bill API] Can not get bill with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})

router.get("/my-bill", async (req, res) => {
    try {
        const owner = await getUserFromHeader(req);
        let {cursor, size} = req.query;

        cursor = cursor || 0;
        size = size || 5;
        
        if (isNaN(cursor) || isNaN(size)) {
            throw new Error("Cursor and size must be number");
        }

        const bill = new Bill();
        const bills = await bill.getBillByUser(owner, cursor, size);
        res.send(bills);
    } catch (error) {
        logger.error(`❌ [Get Bill API] Can not get bill with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})

router.get("/", async (req, res) => {
    try {
        const { ref } = req.query;
        const bill = new Bill();
        const result = await bill.searchOne({ ref }, {
            billItem: true,
            userBill: true,
            owner: true,
            payment: true
        });
        res.send(await result.getResponse());
    } catch (error) {
        logger.error(`❌ [Create Bill API] Can not create bill with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})

router.post("/", async (req, res) => {
    try {
        const owner = await getUserFromHeader(req);
        const bill = new Bill();
        bill.validateBillPayload(req.body, owner);
        await bill.processBillPayload(req.body, owner);
        bill.sendEmail();
        res.send(await bill.getResponse())
    } catch (error) {
        logger.error(`❌ [Create Bill API] Can not create bill with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})

exports.router = router;