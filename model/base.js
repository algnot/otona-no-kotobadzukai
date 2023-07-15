const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class Base {
  _name = null;
  id = null;
  createdAt = null;
  updatedAt = null;
  privateFields = [];
  computeFields = [];

  constructor(_name, id) {
    this._name = _name;
    this.id = id;
  }

  async get(include = false) {
    if (!this.id) {
      throw new Error("id is not defined");
    }

    let result = null;

    if (include) {
      result = await prisma[this._name].findFirst({
        where: {
          id: parseInt(this.id),
        },
        include: include
      });
    } else {
      result = await prisma[this._name].findFirst({
        where: {
          id: parseInt(this.id),
        },
      });
    }

    if (!result) {
      throw new Error(`Not found ${this._name} with id ${this.id}`);
    }
    this.createdAt = result.createdAt;
    this.updatedAt = result.updatedAt;
    const keys = Object.keys(result);
    for (const key of keys) {
      this[key] = result[key];
    }
    for (const computeField of this.computeFields) {
      this[computeField.name] = await computeField.compute(this);
    }
    return this;
  }

  async create(data) {
    const result = await prisma[this._name].create({
      data: data,
    });
    const keys = Object.keys(result);
    for (const key of keys) {
      this[key] = result[key];
    }
    return this;
  }

  async update(data) {
    if (!this.id) {
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

  async delete() {
    if (!this.id) {
      throw new Error("id is not defined");
    }
    const result = await prisma[this._name].delete({
      where: {
        id: this.id,
      },
    });
    return result;
  }

  async getResponse() {
    const keys = Object.keys(this);
    let response = {};
    for (const key of keys) {
      if (
        !this.privateFields.includes(key) &&
        !key.startsWith("_") &&
        key !== "privateFields" &&
        key !== "computeFields" &&
        key !== "_name"
      ) {
        response[key] = this[key];
      }
    }
    for (const computeField of this.computeFields) {
      response[computeField.name] = await computeField.compute(this);
    }
    return response;
  }

  async client() {
    return prisma[this._name];
  }
};
