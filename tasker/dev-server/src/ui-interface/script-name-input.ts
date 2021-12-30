import { updateEnv } from "../helpers/update-env";
import { config } from "../config/config";
import inquirer from "inquirer";

export async function waitScriptNameUpdateAsync(): Promise<void> {
  let { scriptName } = await inquirer.prompt([
    {
      type: "input",
      name: "scriptName",
      message: "Please enter desired script name or press enter to continue current script name",
      validate(inputValue) {
        if (inputValue.endsWith(".js") && inputValue.length > 3) {
          return true;
        } else {
          return "Enter valid script name. Should have extension '*.js'";
        }
      },
      default: config.scriptName,
    },
  ]);

  if (scriptName !== config.scriptName) {
    config.scriptName = scriptName;
    updateEnv("SCRIPT_FILE_NAME", scriptName);
  }
}
