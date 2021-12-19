import { sendAutoRemoteMessage } from "./autoremote";
import { connectionEmmitter } from "../main";
import { Router } from "express";

export const connectionRouter = Router();

const CONNECTION_TIMEOUT: number = 5000;

export async function setupConnectionToTasker(
  hostAddress: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    function onSuccess() {
      resolve(true);
    }

    connectionEmmitter.once("connected", onSuccess);
    sendAutoRemoteMessage("setupconnection", hostAddress);

    setTimeout(() => {
      connectionEmmitter.off("connected", onSuccess);
      reject(false);
    }, CONNECTION_TIMEOUT);
  });
}

connectionRouter.get("/setupconnection", async (req, res) => {
  if (connectionEmmitter.listenerCount("connected") > 0) {
    connectionEmmitter.emit("connected");
    res.send("success");
  } else {
    res.send("fail");
  }
});
