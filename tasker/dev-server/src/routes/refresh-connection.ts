import { sendMessageToTasker, setupConnection } from "../message-sender/message-to-tasker";
import { connectionEmmitter } from "../main";
import { Router } from "express";
import { CONNECTION_TIMEOUT } from "../config/config";
import { errorMessage, successMessage, taskerMessage } from "../helpers/messages";
import { processInputDataAsync } from "../process-data/process-input-data";

export const connectionRouter = Router();

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

    connectionEmmitter.once(connectionEvent, onSuccess);
    setupConnection(hostAddress);

    setTimeout(() => {
      if (!isConnectionSuccessFull) {
        connectionEmmitter.off(connectionEvent, onSuccess);
        errorMessage("Node server failed to connect to tasker", false);
        taskerMessage("Check tasker if tasker network plugin is started");
        reject();
      }
    }, CONNECTION_TIMEOUT);
  });

  await processInputDataAsync(taskerDataResponse);
}

connectionRouter.get("/setupconnection", async (req, res) => {
  if (connectionEmmitter.listenerCount(connectionEvent) > 0 && req.query?.response === "success") {
    taskerDataResponse = JSON.stringify(req.query);
    connectionEmmitter.emit(connectionEvent);
    res.send("success");
  } else {
    res.send("fail");
  }
});
