import { tk } from "tasker-types";

fetch("http://192.168.0.101:4000/script", {
  method: "GET",
})
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    tk.writeFile("Tasker/testscript.js", data, false);
    tk.exit();
  });
