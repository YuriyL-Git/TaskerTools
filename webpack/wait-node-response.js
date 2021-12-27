import http from "http";
import env from "dotenv";

env.config();
const PORT = Number(process.env.WEBPACK_SERVER_PORT?.trim() || 8000);

export default async function waitServerReadyAsync() {
  let shouldContinue = false;
  let scriptName = "";

  const requestListener = function (req, res) {
    if (req.url.includes("tasker-server-ready")) {
      scriptName = req.url.split("?")[1];
      shouldContinue = true;

      console.log("\x1b[32m", "Dev server is ready \n", "\x1b[0m");
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
        resolve(scriptName);
      }
    }, 500);
  });
}
