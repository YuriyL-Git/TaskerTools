const http = require("http");
import env from "dotenv";

env.config();
const PORT = Number(process.env.WEBPACK_SERVER_PORT?.trim() || 8000);

export function sendMessageReadyToWebpack(scriptName: string) {
  console.log("SCRIPT NAME TO SEND", scriptName);
  const options = {
    hostname: "localhost",
    port: PORT,
    path: `/tasker-server-ready?${scriptName}`,
    method: "GET",
  };

  const req = http.request(options, () => {});
  req.end();
}
