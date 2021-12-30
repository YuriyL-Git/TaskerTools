import http from "http";
import env from "dotenv";
import { successMessage } from "./messages.js";

env.config();
const PORT = Number(process.env.WEBPACK_SERVER_PORT?.trim() || 8000);

export default async function waitConfigFromServerAsync() {
  let shouldContinue = false;
  let config = {};

  const requestListener = function (req, res) {
    if (req.url.includes("tasker-server-ready")) {
      config = parseResponse(req.url.split("?")[1]);
      shouldContinue = true;

      successMessage("Dev server is ready \n");
      res.end("success");
    } else {
      res.end("wrong request");
    }
  };
  const server = http
    .createServer(requestListener)
    .listen(PORT, "localhost", () => {});

  return new Promise((resolve) => {
    setInterval(() => {
      if (shouldContinue) {
        server.close();
        setImmediate(function () {
          server.emit("close");
        });
        resolve(config);
      }
    }, 500);
  });
}

function parseResponse(message) {
  return message.split("&").reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    return {
      ...acc,
      [key]: value === "true" ? true : value === "false" ? false : value,
    };
  }, {});
}
