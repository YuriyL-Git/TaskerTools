import http from "http";

export async function waitServerReadyAsync() {
  let shouldContinue = false;

  const requestListener = function (req, res) {
    if (req.url === "/tasker-server-ready") {
      shouldContinue = true;
      console.log("\x1b[32m", "Webpack is ready \n", "\x1b[0m");
      res.end("success");
    } else {
      res.end("wrong request");
    }
  };
  const server = http
    .createServer(requestListener)
    .listen(8000, "localhost", () => {});

  return new Promise((resolve) => {
    setInterval(() => {
      if (shouldContinue) {
        server.close();
        setImmediate(function () {
          server.emit("close");
        });
        resolve();
      }
    }, 500);
  });
}
