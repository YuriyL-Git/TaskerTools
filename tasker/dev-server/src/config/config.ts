import dotenv from "dotenv";

export const ENV_PATH: string = "../../.env";
dotenv.config({ path: ENV_PATH });

export const connectionTimeout = Number(process.env.CONNECTION_TIMEOUT?.trim() || "10000");

const taskName: string = process.env.TASK_NAME?.trim() || "";
const isAutoJs: boolean = process.env.IS_AUTOJS?.trim() === "true";
const scriptName: string = process.env.SCRIPT_FILE_NAME?.trim() || "";
const taskerIp = process.env.TASKER_IP || "";
const taskerPort = process.env.TASKER_PORT || "";
const isAutoRestartOnSave = process.env.IS_AUTO_RESTART_ON_SAVE === "true";

export interface IConfig {
  isAutoJs: boolean;
  isAutoRestartOnSave: boolean;
  taskName: string;
  scriptName: string;
  taskerPort: string;
  taskerIp: string;
  devServerAddress: string;
}

export const config: IConfig = {
  taskName,
  isAutoJs,
  scriptName,
  taskerPort,
  taskerIp,
  devServerAddress: "",
  isAutoRestartOnSave,
};
