const jwtDecode  = require("jwt-decode");
const TokenMapper = require("../model/tokenMapper");
const User = require("../model/user");


module.exports = {
    async getUserFromHeader(req) {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("Authorization header is required");
        }
        const decoded = jwtDecode(authorization);
        const tokenMapper = new TokenMapper(decoded.uid, decoded.exp);
        let user = await tokenMapper.findUser();
        user = await new User(user.id).get();
        return user;
    }
}