import { IConfig } from "../config/config";

export function getTaskerAddress(config: IConfig): string {
  return `http://${config.taskerIp}:${config.taskerPort}/?`;
}
