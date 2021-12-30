import events from "events";
import { setupConnection } from "../message-sender/message-to-tasker";
import { Router } from "express";
import { CONNECTION_TIMEOUT } from "../config/config";
import { errorMessage, successMessage, taskerMessage } from "../helpers/messages";
import { processInputDataAsync } from "../process-data/process-input-data";

export const connectionRouter = Router();

const connectionEmitter = new events.EventEmitter();
const connectionEvent: string = "connected";

let taskerDataResponse: string = "";

export async function refreshConnectionAsync(
  hostAddress: string,
  isFirstStart = false,
): Promise<void> {
  let isConnectionSuccessFull = false;

  await new Promise<void>((resolve, reject) => {
    function onSuccess() {
      if (isFirstStart) {
        successMessage("Node server connected to your tasker application");
      }
      isConnectionSuccessFull = true;
      resolve();
    }

    connectionEmitter.once(connectionEvent, onSuccess);
    setupConnection(hostAddress);

    setTimeout(() => {
      if (!isConnectionSuccessFull) {
        connectionEmitter.off(connectionEvent, onSuccess);
        errorMessage("Node server failed to connect to tasker", false);
        taskerMessage("Check tasker if tasker network plugin is started");
        reject();
      }
    }, CONNECTION_TIMEOUT);
  });

  await processInputDataAsync(taskerDataResponse);
}

connectionRouter.get("/setupconnection", async (req, res) => {
  if (connectionEmitter.listenerCount(connectionEvent) > 0 && req.query?.response === "success") {
    taskerDataResponse = JSON.stringify(req.query);
    connectionEmitter.emit(connectionEvent);

    res.send("success");
  } else {
    res.send("fail");
  }
});
