const express = require('express');
const Logger = require('@taro-common/common-logger');
const User = require('../model/user');
const router = express.Router();
const logger = new Logger();

router.get("/user", async (req, res)=> {
    try {
        let {cursor, size} = req.query;

        cursor = cursor || 0;
        size = size || 5;
        
        if (isNaN(cursor) || isNaN(size)) {
            throw new Error("Cursor and size must be number");
        }

        const {email, name} = req.query;
        const query = {};
        if (email) {
            query.email = {
                contains: email,
            };
        }
        if (name) {
            query.name = {
                contains: name,
            };
        }
        const user = new User();
        const result = await user.searchMany(query, cursor, size);
        result.data = result.data.map((item) => {
            delete item.password;
            delete item.salt;
            delete item.googleAuthId;
            return item;
        })
        res.send(result);
    } catch (error) {
        logger.error(`❌ [Create Bill API] Can not create bill with error: ${error.message}`);
        res.status(400).send(error.message);
    }
})

exports.router = router;