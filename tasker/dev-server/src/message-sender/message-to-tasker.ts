import http from "http";
import dotenv from "dotenv";
import { errorMessage, taskerMessage } from "../helpers/messages";
import { config, ENV_PATH, IConfig } from "../config/config";
import find from "local-devices";
import { updateEnv } from "../helpers/update-env";

dotenv.config({ path: ENV_PATH });

const connectionTimeout = Number(process.env.CONNECTION_TIMEOUT || "10000");
let taskerAddress: string = getTaskerAddress(config);

function getTaskerAddress(config: IConfig): string {
  return `http://${config.taskerIp}:${config.taskerPort}/?`;
}

export function sendMessageToTasker(prefix: string, message: string) {
  http
    .get(taskerAddress + prefix + "=" + message, (result) => {})
    .on("error", (err) => {
      errorMessage("Error: " + err.message);
    });
}

export async function setupConnection(hostaddress: string): Promise<void> {
  const networkDevices: Array<{ ip: string }> = [];
  let isConnected: boolean = false;
  let isTimeOut: boolean = false;

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
        isTimeOut = true;
      }, connectionTimeout);
    }

    if (!isConnected && networkDevices.length > 0) {
      config.taskerIp = networkDevices.pop()?.ip || "";
      taskerAddress = getTaskerAddress(config);
    }
    taskerMessage(
      "Trying to connect to tasker server by address " + taskerAddress.replace("/?", "") + " ...",
    );
  } while (!isConnected || isTimeOut);

  if (isConnected) {
    sendMessageToTasker("hostaddress", hostaddress);

    if (config.taskerIp !== process.env.TASKER_IP?.trim()) {
      updateEnv("TASKER_IP", config.taskerIp);
    }
  } else {
    errorMessage("Failed to connect to tasker. \n", false);
    taskerMessage("Check if network plugin server is started!");
  }
}
