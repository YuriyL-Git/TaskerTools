import express, { Router } from "express";
import bodyParser from "body-parser";
import fileupload from "express-fileupload";
import dotenv from "dotenv";
import ip from "ip";
import {
  connectionRouter,
  refreshConnection,
} from "./routes/refresh-connection";
import events from "events";
import { taskerConfigRouter } from "./routes/get-tasker-config";

dotenv.config({ path: "../.env" });

const PORT: number = Number(process.env.PORT || 4000);
const hostIp = ip.address();
const hostAddress = `${ip.address()}:${PORT}`;

const EventEmitter = events.EventEmitter;
export const connectionEmmitter = new EventEmitter();

refreshConnection(hostAddress, true); //

const app = express();
app.use(express.static("files"));
app.use(fileupload());
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: false,
  })
);
app.use("/", connectionRouter);
app.use("/", taskerConfigRouter);

app.get("/script", (req, res) => {
  console.log("SUCCESS");
  res.send("fail");
});

app.listen(PORT, hostIp, () => {
  console.log("Server started on address: ", hostAddress);
});
