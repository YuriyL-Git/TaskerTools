import { Router } from "express";
import events from "events";
import { sendAutoRemoteMessage } from "../helpers/autoremote";
import { CONNECTION_TIMEOUT } from "../helpers/constants";

export const taskerConfigRouter = Router();

const EventEmitter = events.EventEmitter;
const configReceivedEmmiter = new EventEmitter();
const configReceivedEvent: string = "configreceived";

let configContent: string = "";

export async function waitTaskerConfig(): Promise<string> {
  return new Promise((resolve, reject) => {
    function onSuccess() {
      resolve(configContent);
    }

    configReceivedEmmiter.once(configReceivedEvent, onSuccess);
    sendAutoRemoteMessage("gettaskerconfig", "");

    setTimeout(() => {
      configReceivedEmmiter.off(configReceivedEvent, onSuccess);
      reject();
    }, CONNECTION_TIMEOUT);
  });
}

taskerConfigRouter.post("/gettaskerconfig", async (req, res) => {
  if (configReceivedEmmiter.listenerCount(configReceivedEvent) > 0) {
    configContent = req.body;
    configReceivedEmmiter.emit(configReceivedEvent);
    res.send("success");
  } else {
    res.send("fail");
  }
});
