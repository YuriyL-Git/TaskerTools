import { Router } from "express";

export const logToConsoleRouter = Router();

interface ILogData {
  message: string;
}

logToConsoleRouter.post("/consolelog", async (req, res) => {
  const result = req.body.message != null ? req.body.message : req.body.body;
  //console.log(JSON.stringify(req.body));
  // console.log(req.body.body);
  //console.log(JSON.stringify(req.body.message));
  console.log("\x1b[36m", "DEBUG >>>  " + result);
  res.send("success");
});