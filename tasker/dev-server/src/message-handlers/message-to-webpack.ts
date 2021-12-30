import { config } from "../config/config";

const http = require("http");
import env from "dotenv";

env.config();
const PORT = Number(process.env.WEBPACK_SERVER_PORT?.trim() || 8000);

export function sendConfigToWebpack() {
  const options = {
    hostname: "localhost",
    port: PORT,
    path: `/tasker-server-ready?` + getConfigString(),
    method: "GET",
  };

  const req = http.request(options, () => {});
  req.end();
}

function getConfigString(): string {
  return Object.entries(config)
    .reduce((acc, [key, value]) => {
      return `${acc}&${key}=${value}`;
    }, "")
    .replace(/&/, "");
}
