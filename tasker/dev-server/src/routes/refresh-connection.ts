import events from "events";
import { Router } from "express";
import { connectionTimeout } from "../config/config";
import { errorMessage, successMessage, taskerMessage } from "../helpers/console-messages";
import { setupConnection } from "../setup-connection/setup-connection";

export const connectionRouter = Router();

const connectionEmitter = new events.EventEmitter();
const connectionEvent: string = "connected";

let taskerDataResponse: string = "";

export async function refreshConnectionAsync(): Promise<string> {
  let isConnectionSuccessFull = false;

  return new Promise<string>((resolve, reject) => {
    function onSuccess() {
      isConnectionSuccessFull = true;
      resolve(taskerDataResponse);
    }

    connectionEmitter.once(connectionEvent, onSuccess);
    setupConnection();

    setTimeout(() => {
      if (!isConnectionSuccessFull) {
        connectionEmitter.off(connectionEvent, onSuccess);
        errorMessage("Node server failed to connect to tasker", false);
        taskerMessage("Check tasker if tasker network plugin is started");
        reject();
      }
    }, connectionTimeout);
  });
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
