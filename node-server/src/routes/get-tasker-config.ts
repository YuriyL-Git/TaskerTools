import { Router } from "express";
import events from "events";
import { sendAutoRemoteMessage } from "../helpers/autoremote";
import { CONNECTION_TIMEOUT } from "../helpers/constants";
import { errorMessage } from "../helpers/messages";

export const taskerConfigRouter = Router();

const EventEmitter = events.EventEmitter;
const configReceivedEmmiter = new EventEmitter();
const configReceivedEvent: string = "configreceived";

let configContent: string = "";

export async function waitTaskerConfig(): Promise<string> {
  let isSuccess: boolean = false;
  return new Promise((resolve, reject) => {
    function onSuccess() {
      isSuccess = true;
      resolve(JSON.stringify(configContent));
    }

    configReceivedEmmiter.once(configReceivedEvent, onSuccess);
    sendAutoRemoteMessage("gettaskerconfig", "");

    setTimeout(() => {
      if (!isSuccess) {
        configReceivedEmmiter.off(configReceivedEvent, onSuccess);
        errorMessage("Tasker config request failed");
        reject();
      }
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
