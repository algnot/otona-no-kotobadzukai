const Base = require("./base.js");
const bcrypt = require("bcryptjs");
const { validateEmail } = require("../common/validater.js");
const sign = require("jwt-encode");
const TokenMapper = require("./tokenMapper.js");
const Logger = require("@taro-common/common-logger");
const logger = new Logger();


module.exports = class User extends Base {
  uid = null;
  name = null;
  email = null;
  password = null;
  salt = null;
  googleAuthId = null;
  tokens = [];

  constructor(id = null) {
    super("User", id);
    this.privateFields = ["password", "salt"];
  }

  async register(name, email, password) {
    if (await !validateEmail(email)) {
      throw new Error("Email is not valid");
    }
    const client = await this.client();
    const uniqueEmail = await client.findUnique({
      where: {
        email: email,
      },
    });
    if (uniqueEmail) {
      throw new Error("Email is already used");
    }
    const salt = await this.genSult();
    await this.create({
      name: name,
      email: email,
      password: await bcrypt.hash(password, salt),
      salt: salt,
      uid: await this.randomUid(),
    });
    return this;
  }

  async setPassword(password) {
    if(!this.salt){
      this.salt = await this.genSult();
    }
    const passwordEncrypt = await bcrypt.hash(password, this.salt);
    await this.update({
      password: passwordEncrypt,
    })
    return this;
  }

  async registerWithGoogle(name, email, googleAuthId) {
    if (await !validateEmail(email)) {
      throw new Error("Email is not valid");
    }
    const client = await this.client();
    await client.upsert({
      where: {
        email: email,
      },
      update: {
        googleAuthId: googleAuthId,
      },
      create: {
        name: name,
        email: email,
        googleAuthId: googleAuthId,
        uid: await this.randomUid(),
        salt: await this.genSult()
      }
    })
    const user = await client.findFirstOrThrow({
      where: {
        email: email,
      },
    });
    this.id = user.id;
    await this.get();
    return this;
  }

  async genSult() {
    const salt = await bcrypt.genSalt(10);
    return salt;
  }

  async randomUid() {
    const uid =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return uid;
  }

  async login(email, password) {
    const client = await this.client();
    const user = await client.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("Email is not found");
    }
    if(!user.password) {
      throw new Error("User is registered with Google account");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Password is not correct");
    }
    this.id = user.id;
    await this.get();
    return this;
  }

  async getJWT() {
    try {
      const secret = this.salt;
      const exp = Date.now().valueOf() + 1000 * 60 * 60 * 24 * 7;
      const payload = {
        iat: Date.now().valueOf(),
        exp: exp,
        uid: this.uid,
      };
      const token = sign(payload, secret);
      const tokenMapper = new TokenMapper();
      await tokenMapper.create({
        exp: exp.toString(),
        uid: this.uid
      })
      return token;
    } catch (error) {
        logger.error(error);
        throw new Error("Can not get JWT");
    }
  }
};
