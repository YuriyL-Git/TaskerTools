import { config } from "../config/config";

const http = require("http");
import env from "dotenv";

env.config();
const PORT = Number(process.env.WEBPACK_SERVER_PORT?.trim() || 8000);

export function sendMessageReadyToWebpack() {
  const options = {
    hostname: "localhost",
    port: PORT,
    path: `/tasker-server-ready?${config.scriptName}`,
    method: "GET",
  };

  const req = http.request(options, () => {});
  req.end();
}
