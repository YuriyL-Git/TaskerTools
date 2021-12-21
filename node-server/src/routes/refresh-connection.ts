import { sendAutoRemoteMessage } from "../helpers/autoremote";
import { connectionEmmitter } from "../main";
import { Router } from "express";
import { CONNECTION_TIMEOUT } from "../helpers/constants";
import { errorMessage, successMessage } from "../helpers/messages";
import { processTaskerResponse } from "../process-data/process-tasker-response";

export const connectionRouter = Router();

const connectionEvent: string = "connected";
let taskerDataResponse: string = "";

export async function refreshConnection(
  hostAddress: string,
  isFirstStart = false
): Promise<void> {
  let isConnectionSuccessFull = false;

  await new Promise((resolve, reject) => {
    function onSuccess() {
      if (isFirstStart) {
        successMessage("Node server connected to your tasker application");
      }
      isConnectionSuccessFull = true;
      resolve("");
    }

    connectionEmmitter.once(connectionEvent, onSuccess);
    sendAutoRemoteMessage("setupconnection", hostAddress);

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

  await processTaskerResponse(taskerDataResponse);
  // await processTaskerConfig();
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
