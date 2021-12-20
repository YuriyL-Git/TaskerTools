import express, { Router } from "express";
import dotenv from "dotenv";
import ip from "ip";
import { getFileContent } from "./helpers/get-file-content";
import {
  connectionRouter,
  refreshConnection,
} from "./routes/refresh-connection";
import events from "events";
import {
  errorMessage,
  successMessage,
  taskerMessage,
} from "./helpers/messages";
import { taskerConfigRouter } from "./routes/get-tasker-config";

dotenv.config({ path: "../.env" });

const PORT: number = Number(process.env.PORT || 4000);
const hostIp = ip.address();
const hostAddress = `${ip.address()}:${PORT}`;

const EventEmitter = events.EventEmitter;
export const connectionEmmitter = new EventEmitter();

refreshConnection(hostAddress, true); //

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(`${__dirname}/public`));
app.use(express.static("files"));
app.use("/", connectionRouter);
app.use("/", taskerConfigRouter);

app.get("/script", async (req, res) => {
  const scriptContent = await getFileContent();
  res.send(scriptContent);
});

app.listen(PORT, hostIp, () => {
  console.log("Server started on address: ", hostAddress);
});
