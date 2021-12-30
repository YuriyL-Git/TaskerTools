import { Router } from "express";
import events from "events";
import { sendMessageToTasker } from "../message-handlers/message-to-tasker";
import { connectionTimeout } from "../config/config";
import { errorMessage } from "../helpers/console-messages";

export const taskerConfigRouter = Router();

const EventEmitter = events.EventEmitter;
const configReceivedEmmiter = new EventEmitter();
const configReceivedEvent: string = "configreceived";

let configContent: string = "";

export async function waitTaskerConfigAsync(): Promise<string> {
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
    }, connectionTimeout);
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
