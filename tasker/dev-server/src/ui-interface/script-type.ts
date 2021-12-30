import inquirer from "inquirer";
import { config } from "../config/config";
import { updateEnv } from "../helpers/update-env";

export async function waitScriptTypeAsync(): Promise<void> {
  const defaultItemNumber: number = config.isAutoJs ? 0 : 1;
  let { scriptType } = await inquirer.prompt([
    {
      type: "list",
      pageSize: 2,
      name: "scriptType",
      message: "Select script type",
      choices: ["AutoJs", "TaskerJs"],
      default: defaultItemNumber,
    },
  ]);

  const isAutoJs: boolean = scriptType === "AutoJs";
  if (config.isAutoJs !== isAutoJs) {
    config.isAutoJs = isAutoJs;
    updateEnv("IS_AUTOJS", isAutoJs.toString());
  }
}
