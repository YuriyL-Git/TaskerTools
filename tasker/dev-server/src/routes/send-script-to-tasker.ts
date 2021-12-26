import { Router } from "express";
import path from "path";
import { scriptData } from "../process-data/process-input-data";

function getScriptPath(): string {
  return path.resolve(__dirname, "../../../../dist/" + scriptData.name);
}

export const sendScriptRouter = Router();

sendScriptRouter.get("/getscript", async (req, res) => {
  const scriptPath: string = getScriptPath();
  res.sendFile(scriptPath);
});
