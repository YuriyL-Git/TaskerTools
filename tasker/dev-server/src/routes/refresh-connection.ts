import {
  sendMessageToTasker,
  setupConnection,
} from "../message-sender/message-sender";
import { connectionEmmitter } from "../main";
import { Router } from "express";
import { CONNECTION_TIMEOUT } from "../config/config";
import { errorMessage, successMessage } from "../helpers/messages";
import { processInputDataAsync } from "../process-data/process-input-data";

export const connectionRouter = Router();

const connectionEvent: string = "connected";
let taskerDataResponse: string = "";

export async function refreshConnectionAsync(
  hostAddress: string,
  isFirstStart = false
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

    ///
    connectionEmmitter.once(connectionEvent, onSuccess);
    // sendAutoRemoteMessage("setupconnection", hostAddress);
    //sendMessageToTasker("hostaddress", hostAddress);
    setupConnection(hostAddress);
    console.log("CONNECTION_TIMEOUT", CONNECTION_TIMEOUT);

    setTimeout(() => {
      if (!isConnectionSuccessFull) {
        connectionEmmitter.off(connectionEvent, onSuccess);
        errorMessage("Node server failed to connect to tasker");
        errorMessage(
          "Check your auto remote key(AUTO_REMOTE_KEY) in .env file and restart the server"
        );
        reject();
      }
    }, CONNECTION_TIMEOUT);
  });

  await processInputDataAsync(taskerDataResponse);
  // await processTaskerConfig();////
}

connectionRouter.get("/setupconnection", async (req, res) => {
  console.log("CONNECTION"); //
  console.log(req.query.response);
  if (
    connectionEmmitter.listenerCount(connectionEvent) > 0 &&
    req.query?.response === "success"
  ) {
    taskerDataResponse = JSON.stringify(req.query);
    connectionEmmitter.emit(connectionEvent);
    res.send("success");
  } else {
    res.send("fail");
  }
});
