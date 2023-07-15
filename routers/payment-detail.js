const express = require('express');
const Logger = require('@taro-common/common-logger');
const TokenMapper = require('../model/tokenMapper');
const router = express.Router();
const jwtDecode = require("jwt-decode");
const { validatePayload } = require('../common/validater');
const PaymentDetail = require('../model/PaymentDetail');
const logger = new Logger();

router.post('/', async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("Authorization header is required");
        }
        const { name, number, isPromptpay } = req.body;
        validatePayload(['name', 'number', 'isPromptpay'], req.body);
        const decoded = jwtDecode(authorization);
        const tokenMapper = new TokenMapper(decoded.uid, decoded.exp);
        let user = await tokenMapper.findUser();

        const paymentDetail = await new PaymentDetail().create({
            name: name,
            number: number,
            isPromptpay: isPromptpay,
            uid: user.uid,
        });
        res.send(await paymentDetail.getResponse());
    } catch (error) {
        logger.error(`❌ [Create Payment Detail API] Can not Create Payment Detail with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("Authorization header is required");
        }
        const { id } = req.params;
        const decoded = jwtDecode(authorization);
        const tokenMapper = new TokenMapper(decoded.uid, decoded.exp);
        let user = await tokenMapper.findUser();

        const paymentDetail = await new PaymentDetail(id).get({
            user: true,
        });
        if (paymentDetail.uid !== user.uid) {
            throw new Error("This payment detail is not yours");
        }
        res.send(await paymentDetail.getResponse());
    } catch (error) {
        logger.error(`❌ [Get Payment Detail API] Can not Get Payment Detail with error: ${error.message}`);
        res.status(400).send(error.message); 
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("Authorization header is required");
        }
        const { id } = req.params;
        const { name, number, isPromptpay } = req.body;
        let preparedPayload = {};
        if (name) {
            preparedPayload.name = name;
        }
        if (number) {
            preparedPayload.number = number;
        }
        if (isPromptpay !== undefined) {
            preparedPayload.isPromptpay = isPromptpay;
        }
        const decoded = jwtDecode(authorization);
        const tokenMapper = new TokenMapper(decoded.uid, decoded.exp);
        let user = await tokenMapper.findUser();

        const paymentDetail = await new PaymentDetail(id).get({
            user: true,
        });
        if (paymentDetail.uid !== user.uid) {
            throw new Error("This payment detail is not yours");
        }
        await paymentDetail.update(preparedPayload);
        res.send(await paymentDetail.getResponse());
    } catch (error) {
        logger.error(`❌ [Update Payment Detail API] Can not Update Payment Detail with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("Authorization header is required");
        }
        const { id } = req.params;
        const decoded = jwtDecode(authorization);
        const tokenMapper = new TokenMapper(decoded.uid, decoded.exp);
        let user = await tokenMapper.findUser();

        const paymentDetail = await new PaymentDetail(id).get({
            user: true,
        });
        if (paymentDetail.uid !== user.uid) {
            throw new Error("This payment detail is not yours");
        }
        await paymentDetail.delete();
        res.send(await paymentDetail.getResponse());
    } catch (error) {
        logger.error(`❌ [Delete Payment Detail API] Can not Delete Payment Detail with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})


exports.router = router;