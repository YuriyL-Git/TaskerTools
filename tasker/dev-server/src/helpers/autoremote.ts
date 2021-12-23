import https from "https";
import dotenv from "dotenv";
import { errorMessage } from "./messages";
import { ENV_PATH } from "../config/config";

dotenv.config({ path: ENV_PATH });
const autoRemoteKey = process.env.AUTO_REMOTE_KEY;

const autoRemoteUrl =
  "https://autoremotejoaomgcd.appspot.com/sendmessage?key=" +
  autoRemoteKey +
  "&message=";

export function sendAutoRemoteMessage(
  prefix: string,
  command: string,
  consoleMessage: string = ""
) {
  https
    .get(autoRemoteUrl + prefix + "=:=" + command, (result) => {
      console.log(consoleMessage);
    })
    .on("error", (err) => {
      errorMessage("Error: " + err.message);
    });
}
