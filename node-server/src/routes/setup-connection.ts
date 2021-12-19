import { sendAutoRemoteMessage } from "../helpers/autoremote";
import { connectionEmmitter } from "../main";
import { Router } from "express";
import { CONNECTION_TIMEOUT } from "../helpers/constants";

export const connectionRouter = Router();

const connectionEvent: string = "connected";

export async function setupConnectionToTasker(
  hostAddress: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    function onSuccess() {
      resolve();
    }

    connectionEmmitter.once(connectionEvent, onSuccess);
    sendAutoRemoteMessage("setupconnection", hostAddress);

    setTimeout(() => {
      connectionEmmitter.off(connectionEvent, onSuccess);
      reject();
    }, CONNECTION_TIMEOUT);
  });
}

connectionRouter.get("/setupconnection", async (req, res) => {
  if (connectionEmmitter.listenerCount(connectionEvent) > 0) {
    connectionEmmitter.emit(connectionEvent);

    res.send("success");
  } else {
    res.send("fail");
  }
});
