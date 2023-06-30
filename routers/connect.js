const express = require('express');
const User = require('../model/user');
const Logger = require('@taro-common/common-logger');
const TokenMapper = require('../model/tokenMapper');
const router = express.Router();
const jwtDecode = require("jwt-decode");
const logger = new Logger();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await new User().register(name, email, password);
        res.send(await user.getResponse());
    } catch (error) {
        logger.error(`❌ [Register API] Can not register with error: ${error}`);
        res.status(400).json({
            status :error.message
        });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await new User().login(email, password);
        res.send(await user.getJWT());
    } catch (error) {
        logger.error(`❌ [Login API] Can not login with error: ${error}`);
        res.status(400).json({
            status :error.message
        });
    }
})

router.get('/me', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const decoded = jwtDecode(authorization);
        const tokenMapper = new TokenMapper(decoded.uid, decoded.exp);
        let user = await tokenMapper.findUser();
        user.password = undefined;
        user.salt = undefined;
        user.googleAuthId = undefined;
        res.send(user);
    } catch (error) {
        logger.error(`❌ [Get account API] Can not get me with error: ${error}`);
        res.status(400).json({
            status :error.message
        });
    }
})

exports.router = router;