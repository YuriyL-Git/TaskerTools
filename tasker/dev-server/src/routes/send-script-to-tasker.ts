import { Router } from "express";
import path from "path";
import { config } from "../config/config";

function getScriptPath(): string {
  return path.resolve(__dirname, "../../../../dist/" + config.scriptName);
}

export const sendScriptRouter = Router();

sendScriptRouter.get("/getscript", async (req, res) => {
  const scriptPath: string = getScriptPath();
  res.sendFile(scriptPath);
});
