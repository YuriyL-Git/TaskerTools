const http = require("http");

export function sendMessageReadyToWebpack() {
  const options = {
    hostname: "localhost",
    port: 8000,
    path: "/tasker-server-ready",
    method: "GET",
  };

  const req = http.request(options, () => {});
  req.end();
}
