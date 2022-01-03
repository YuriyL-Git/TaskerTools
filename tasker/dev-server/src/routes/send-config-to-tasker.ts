import { Router } from "express";
import { getConfigString } from "../helpers/get-config-string";

export const sendConfigToTaskerRouter = Router();

sendConfigToTaskerRouter.get("/getconfig", async (req, res) => {
  res.send(getConfigString());
});
