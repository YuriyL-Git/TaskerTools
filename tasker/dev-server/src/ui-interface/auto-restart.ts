import inquirer from "inquirer";
import { config } from "../config/config";
import { updateEnv } from "../helpers/update-env";

export async function waitIsAutoRestartAsync(): Promise<void> {
  const defaultItemNumber: number = config.isAutoRestartOnSave ? 0 : 1;

  let { isAutoRestartResult } = await inquirer.prompt([
    {
      type: "list",
      pageSize: 2,
      name: "isAutoRestartResult",
      message: "Auto restart  on save?",
      choices: ["Yes", "No"],
      default: defaultItemNumber,
    },
  ]);

  const isAutoRestart: boolean = isAutoRestartResult === "Yes";
  if (config.isAutoRestartOnSave !== isAutoRestart) {
    config.isAutoRestartOnSave = isAutoRestart;
    updateEnv("IS_AUTO_RESTART_ON_SAVE", config.isAutoRestartOnSave.toString());
  }
}
