import dotenv from "dotenv";
import fs from "fs";
import { ENV_PATH } from "../config/config";

export function updateEnv(varName: string, value: string, eol = "\n") {
  const envFile = fs.readFileSync(ENV_PATH);
  const envBuffer = Buffer.from(envFile);
  const currentConfig = dotenv.parse(envBuffer);

  const envUpdate: Record<string, string> = {
    [varName]: value,
  };

  const envContents = Object.entries({ ...currentConfig, ...envUpdate })
    .map(([key, val]) => `${key}=${val}`)
    .join(eol);
  fs.writeFileSync(ENV_PATH, envContents);
}
