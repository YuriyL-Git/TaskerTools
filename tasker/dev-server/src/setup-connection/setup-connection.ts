import http from "http";
import find from "local-devices";
import { config } from "../config/config";
import { errorMessage, taskerMessage } from "../helpers/console-messages";
import { updateEnv } from "../helpers/update-env";
import { sendMessageToTasker } from "../message-handlers/message-to-tasker";
import { getTaskerAddress } from "../helpers/get-tasker-address";

const connectionTimeout = Number(process.env.CONNECTION_TIMEOUT || "10000");

export async function setupConnection(): Promise<void> {
  const networkDevices: Array<{ ip: string }> = [];
  let taskerAddress: string = getTaskerAddress(config);

  let isConnected: boolean = false;
  let timeIsOut: boolean = false;

  do {
    try {
      isConnected = await new Promise<boolean>((resolve, reject) => {
        try {
          http
            .get(taskerAddress + "setupconnection", () => {
              resolve(true);
            })
            .on("error", () => {
              reject();
            });
        } catch {
          reject();
        }
      });
    } catch {}

    if (!isConnected && networkDevices.length === 0) {
      networkDevices.push(...(await find()));

      setTimeout(() => {
        timeIsOut = true;
      }, connectionTimeout);
    }

    if (!isConnected && networkDevices.length > 0) {
      config.taskerIp = networkDevices.pop()?.ip || "";
      taskerAddress = getTaskerAddress(config);
    }
    taskerMessage(
      "Trying to connect to tasker server by address " + taskerAddress.replace("/?", "") + " ...",
    );
  } while (!isConnected || timeIsOut);

  if (isConnected) {
    sendMessageToTasker("hostaddress", config.devServerAddress);

    if (config.taskerIp !== process.env.TASKER_IP?.trim()) {
      updateEnv("TASKER_IP", config.taskerIp);
    }
  } else {
    errorMessage("Failed to connect to tasker. \n", false);
    taskerMessage("Check if network plugin server is started!");
  }
}
