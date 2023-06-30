const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const Logger = require('@taro-common/common-logger');
const Config = require('@taro-common/common-config');
require("dotenv").config();

const post = process.env.port || 4000;

// Logger
const logger = new Logger();
 
// Config
const config = new Config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cors());

const routers = fs.readdirSync("./routers");

routers.forEach((router) => {
  try {
    const routerPath = `./routers/${router}`;
    const routerName = router.replace(".js", "");
    app.use(`/${routerName}`, require(routerPath).router);
    logger.info(`✔️  Router /${routerName} is created`);
  } catch (error) {
    logger.error(`❌  Router /${router} is not created with error: ${error}`);
  }
});

app.get("/", (req, res) => {
  res.send("Hello world");
})

app.listen(post, async () => {
  try {
    logger.info(`🤖 Server is running on port ${post}`);
  } catch (error) {
    logger.error(`❌ Error when starting server: ${error}`);
  }
});