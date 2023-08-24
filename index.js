const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const Logger = require('@taro-common/common-logger');
require("dotenv").config();
const multer = require("multer");

const post = process.env.port || 4000;

// Logger
const logger = new Logger();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(multer({ dest: "./public/uploads/" }).any());

app.use((req, res, next) => {
  if (req.files) {
    const file = req.files[0];
    if (file.size > 1024 * 1024 * 20) {
      return res.status(400).send({
        message: "File is too large (max 20MB)",
      });
    }
  }
  next();
});

const routers = fs.readdirSync("./routers");

fs.readdirSync("./public").forEach((file) => {
  if (file.includes(".pdf")) {
    fs.unlinkSync(`./public/${file}`);
  }
});

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
    logger.info(`🤖 Server is running on http://localhost:${post}`);
  } catch (error) {
    logger.error(`❌ Error when starting server: ${error}`);
  }
});