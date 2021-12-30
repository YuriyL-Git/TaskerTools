import ip from "ip";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import fileupload from "express-fileupload";
import { taskerConfigRouter } from "./routes/get-tasker-config";
import { connectionRouter, refreshConnectionAsync } from "./routes/refresh-connection";
import { sendScriptRouter } from "./routes/send-script-to-tasker";
import { logToConsoleRouter } from "./routes/log-to-console";
import { sendMessageReadyToWebpack } from "./message-sender/message-to-webpack";
import { config } from "./config/config";

dotenv.config({ path: "../.env" });

const port: number = Number(process.env.DEV_SERVER_PORT || 4000);
const hostIp = ip.address();
config.devServerAddress = `${hostIp}:${port}`;

const app = express();
app.use(express.static("files"));
app.use(fileupload());
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: false,
  }),
);
app.use("/", connectionRouter);
app.use("/", taskerConfigRouter);
app.use("/", sendScriptRouter);
app.use("/", logToConsoleRouter);

app.listen(port, hostIp, () => {
  console.log("\n Server started on address: ", config.devServerAddress);
});

refreshConnectionAsync(config.devServerAddress, true).then(() => {
  sendMessageReadyToWebpack();
});
