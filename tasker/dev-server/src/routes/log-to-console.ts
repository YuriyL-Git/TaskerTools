import { Router } from "express";

export const logToConsoleRouter = Router();

interface ILogData {
  message: string;
}

logToConsoleRouter.post("/consolelog", async (req, res) => {
  console.log("\x1b[36m", "DEBUG >>>  " + req.body.message);
  res.send("success");
});
