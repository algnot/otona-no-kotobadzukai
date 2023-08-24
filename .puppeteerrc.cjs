const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
const isLocal = process.env.environment === "local";

module.exports = isLocal ? {
  // local
} :{
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, "../.cache", "puppeteer"),
};
