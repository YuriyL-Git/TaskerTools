import http from "http";
import { errorMessage } from "../helpers/console-messages";
import { config } from "../config/config";
import { getTaskerAddress } from "../helpers/get-tasker-address";

export function sendMessageToTasker(prefix: string, message: string) {
  const taskerAddress: string = getTaskerAddress(config);
  http.get(taskerAddress + prefix + "=" + message).on("error", (err) => {
    errorMessage("Error: " + err.message);
  });
}
