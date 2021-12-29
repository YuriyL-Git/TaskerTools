import http from "http";
import dotenv from "dotenv";
import { errorMessage, taskerMessage } from "../helpers/messages";
import { ENV_PATH } from "../config/config";
import find from "local-devices";
import { updateEnv } from "../helpers/update-env";

dotenv.config({ path: ENV_PATH });
let taskerIp = process.env.TASKER_IP || "";
const taskerPort = process.env.TASKER_PORT || "";
const CONNECTION_TIMEOUT = Number(process.env.CONNECTION_TIMEOUT || "10000");
let taskerAddress: string = getTaskerAddress(taskerIp, taskerPort);

function getTaskerAddress(ip: string, port: string): string {
  return `http://${ip}:${port}/?`;
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
      }, CONNECTION_TIMEOUT);
    }

    if (!isConnected && networkDevices.length > 0) {
      taskerIp = networkDevices.pop()?.ip || "";
      taskerAddress = getTaskerAddress(taskerIp, taskerPort);
    }
    taskerMessage(
      "Trying to connect to tasker server by address " + taskerAddress.replace("/?", "") + " ...",
    );
  } while (!isConnected || isTimeOut);

  if (isConnected) {
    sendMessageToTasker("hostaddress", hostaddress);

    if (taskerIp !== process.env.TASKER_IP) {
      updateEnv("TASKER_IP", taskerIp);
    }
  } else {
    errorMessage("Failed to connect to tasker. \n", false);
    taskerMessage("Check if network plugin server is started!");
  }
}
