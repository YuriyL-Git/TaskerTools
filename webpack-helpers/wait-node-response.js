import http from "http";

export async function waitServerReadyAsync() {
  let shouldContinue = false;

  const requestListener = function (req, res) {
    console.log(req.url);
    if (req.url === "/success") {
      shouldContinue = true;
      res.end("success");
    } else {
      res.end("wrong request");
    }
  };
  http.createServer(requestListener).listen(8000, "localhost", () => {});

  return new Promise((resolve) => {
    setInterval(() => {
      if (shouldContinue) {
        resolve();
      }
    }, 500);
  });
}
