import http from "http";
import dotenv from "dotenv";
import { errorMessage } from "./messages";
import { ENV_PATH } from "../config/config";
import find from "local-devices";
import { updateEnv } from "./update-env";

dotenv.config({ path: ENV_PATH });
let taskerIp = process.env.TASKER_IP || "";
const taskerPort = process.env.TASKER_PORT || "";
const CONNECTION_TIMEOUT = Number(process.env.CONNECTION_TIMEOUT || "10000");
let taskerAddress: string = getTaskerAddress(taskerIp, taskerPort);

interface networkDevice {
  ip: string;
}

function getTaskerAddress(ip: string, port: string): string {
  return `http://${ip}:${port}/?`;
}

export async function setupConnection(hostaddress: string): Promise<void> {
  const networkDevices: Array<networkDevice> = [];
  let isSuccessfull: boolean = false;
  let isTimeOut: boolean = false;

  do {
    try {
      isSuccessfull = await new Promise<boolean>((resolve, reject) => {
        try {
          http
            .get(taskerAddress + "setupconnection", () => {
              resolve(true);
            })
            .on("/invalid-redirect", (_, response) => {
              response.writeHead(302, {
                Location: "//",
              });
              resolve(false);
              response.end();
            });
        } catch {
          reject();
          console.log("EEE");
        }
      });
    } catch {
      console.log("ERR");
    }

    if (!isSuccessfull && networkDevices.length === 0) {
      networkDevices.push(...(await find()));
      setTimeout(() => {
        isTimeOut = true;
      }, CONNECTION_TIMEOUT);
    }

    if (!isSuccessfull && networkDevices.length > 0) {
      taskerIp = networkDevices.pop()?.ip || "";
      taskerAddress = getTaskerAddress(taskerIp, taskerPort);
      console.log("TASKER ADDRESS=", taskerAddress);
    }
  } while (!isSuccessfull || isTimeOut);

  if (isSuccessfull) {
    sendMessageToTasker("hostaddress", hostaddress);

    if (taskerIp !== process.env.TASKER_IP) {
      updateEnv("TASKER_IP", taskerIp);
    }
  }
}

export function sendMessageToTasker(prefix: string, message: string) {
  http
    .get(taskerAddress + prefix + "=" + message, (result) => {})
    .on("error", (err) => {
      errorMessage("Error: " + err.message);
    });
}
