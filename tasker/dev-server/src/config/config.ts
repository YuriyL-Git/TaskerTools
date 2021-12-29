import dotenv from "dotenv";

export const ENV_PATH: string = "../../.env";

dotenv.config({ path: ENV_PATH });

export const CONNECTION_TIMEOUT = Number(process.env.CONNECTION_TIMEOUT?.trim() || "10000");

const taskName: string = process.env.TASK_NAME?.trim() || "";
const isAutoJs: boolean = process.env.IS_AUTOJS?.trim() === "true";
const scriptName: string = process.env.SCRIPT_FILE_NAME?.trim() || "";

interface IConfig {
  isAutoJs: boolean;
  taskName: string;
  scriptName: string;
}

export const config: IConfig = {
  taskName,
  isAutoJs,
  scriptName,
};
