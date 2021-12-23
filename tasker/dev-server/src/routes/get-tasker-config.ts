import { Router } from "express";
import events from "events";
import { sendMessageToTasker } from "../helpers/autoremote";
import { CONNECTION_TIMEOUT } from "../config/config";
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
    sendMessageToTasker("gettaskerconfig", "");

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
