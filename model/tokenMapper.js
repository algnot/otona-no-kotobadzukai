const Base = require("./base");


module.exports = class TokenMapper extends Base {
    exp = null;
    user = null;
    uid = null;

    constructor(uid, exp, id=null) {
        super("TokenMapper", id);
        this.privateFields = ["exp"];
        this.uid = uid;
        this.exp = exp;
    }

    async findUser() {
        if (!this.uid) {
            throw new Error("Uid is not defined");
        }
        if (this.exp < Date.now().valueOf()) {
            throw new Error("Token is expired");
        }
        const client = await this.client();
        const user = await client.findFirst({
            where: {
                uid: this.uid,
                exp: this.exp.toString(),
                isActive: true
            },
            include: {
                user: true,
            }
        });
        if (!user) {
            throw new Error("Json web token is not valid");
        }
        this.user = user.user;
        return user.user;
    }

}