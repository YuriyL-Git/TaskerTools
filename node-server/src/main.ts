import express, { Router } from "express";
import dotenv from "dotenv";
import fileupload from "express-fileupload";
import ip from "ip";
import { getFileContent } from "./helpers/get-file-content";
import {
  connectionRouter,
  setupConnectionToTasker,
} from "./helpers/setup-connection";
import events from "events";
import {
  errorMessage,
  successMessage,
  taskerMessage,
} from "./helpers/messages";

dotenv.config({ path: "../.env" });

const PORT: number = Number(process.env.PORT || 4000);
const hostIp = ip.address();
const hostAddress = `${ip.address()}:${PORT}`;

const EventEmitter = events.EventEmitter;
export const connectionEmmitter = new EventEmitter();

setupConnectionToTasker(hostAddress)
  .then(() => {
    successMessage("Node server connected to your tasker application");
  })
  .catch(() => {
    errorMessage("Node server failed to connect to tasker");
    taskerMessage(
      "Check your auto remote key(AUTO_REMOTE_KEY) in .env file and restart the server"
    );
  });

const app = express(); //

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(`${__dirname}/public`));
app.use(fileupload());
app.use(express.static("files"));
app.use("/", connectionRouter);

app.get("/script", async (req, res) => {
  const scriptContent = await getFileContent();
  res.send(scriptContent);
});

app.listen(PORT, hostIp, () => {
  console.log("Server started on address: ", hostAddress);
});
