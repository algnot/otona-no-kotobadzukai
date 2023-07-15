const express = require('express');
const User = require('../model/user');
const Logger = require('@taro-common/common-logger');
const TokenMapper = require('../model/tokenMapper');
const router = express.Router();
const jwtDecode = require("jwt-decode");
const logger = new Logger();

router.put('/', async (req, res) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("Authorization header is required");
        }
        const decoded = jwtDecode(authorization);
        const tokenMapper = new TokenMapper(decoded.uid, decoded.exp);
        let user = await tokenMapper.findUser();
        user = await new User(user.id).get();

        let prepareUpdate = {};
        if (req.body.username) {
            prepareUpdate.name = req.body.username;
        }
        await user.update(prepareUpdate)
        res.send(await user.getResponse());
    } catch (error) {
        logger.error(`❌ [Update User API] Can not update with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})

exports.router = router;