import https from "https";
import dotenv from "dotenv";
import { errorMessage, successMessage } from "./messages";

dotenv.config({ path: "../.env" });

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
