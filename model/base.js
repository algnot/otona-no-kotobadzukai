const { PrismaClient } = require ("@prisma/client");
const prisma = new PrismaClient();


module.exports = class Base {
    _name = null;
    id = null;
    createdAt = null;
    updatedAt = null;
    privateFields = [];

    constructor(_name, id){
        this._name = _name;
        this.id = id;
    }

    async get(){
        if(!this.id) {
            throw new Error("id is not defined");
        }
        const result = await prisma[this._name].findFirst({
            where: {
              id: this.id,
            },
        });
        this.createdAt = result.createdAt;
        this.updatedAt = result.updatedAt;
        const keys = Object.keys(result);
        for (const key of keys) {
            this[key] = result[key];
        }
        return this;
    }

    async create(data){
        const result = await prisma[this._name].create({
            data: data,
        });
        const keys = Object.keys(result);
        for (const key of keys) {
            this[key] = result[key];
        }
        return this;
    }

    async update(data){
        if(!this.id) {
            throw new Error("id is not defined");
        }
        const result = await prisma[this._name].update({
            where: {
                id: this.id,
            },
            data: data,
        });
        const keys = Object.keys(result);
        for (const key of keys) {
            this[key] = result[key];
        }
        return this;
    }

    async getResponse() {
        const keys = Object.keys(this);
        let response = {};
        for (const key of keys) {
            if(!this.privateFields.includes(key)){
                response[key] = this[key];
            }
        }
        return response;
    }

    async client(){
        return prisma[this._name];
    }
}