import ip from "ip";
import dotenv from "dotenv";
import events from "events";
import express from "express";
import bodyParser from "body-parser";
import fileupload from "express-fileupload";
import { taskerConfigRouter } from "./routes/get-tasker-config";
import { connectionRouter, refreshConnectionAsync } from "./routes/refresh-connection";
import { sendScriptRouter } from "./routes/send-script-to-tasker";
import { logToConsoleRouter } from "./routes/log-to-console";
import { updateEnv } from "./helpers/update-env";

dotenv.config({ path: "../.env" });

const PORT: number = Number(process.env.PORT || 4000);
const hostIp = ip.address();
const hostAddress = `${ip.address()}:${PORT}`;
updateEnv("DEV_SERVER_ADDRESS", hostAddress);

const EventEmitter = events.EventEmitter;
export const connectionEmitter = new EventEmitter();

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

app.get("/script", (req, res) => {
  console.log("SUCCESS");
  res.send("fail");
});

app.listen(PORT, hostIp, () => {
  console.log("\n Server started on address: ", hostAddress);
});

refreshConnectionAsync(hostAddress, true);
