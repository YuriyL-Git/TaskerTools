import { config } from "../config/config";

export function getConfigString(): string {
  return Object.entries(config)
    .reduce((acc, [key, value]) => {
      return `${acc}&${key}=${value}`;
    }, "")
    .replace(/&/, "");
}
