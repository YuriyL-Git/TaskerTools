import dotenv from "dotenv";

export const ENV_PATH: string = "../../.env";

dotenv.config({ path: ENV_PATH });

export const CONNECTION_TIMEOUT = Number(
  process.env.CONNECTION_TIMEOUT?.trim() || "10000"
);
