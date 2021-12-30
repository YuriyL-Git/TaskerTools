import { waitUserInputAsync } from "../helpers/wait-user-input";
import { updateEnv } from "../helpers/update-env";
import { config } from "../config/config";

export async function waitScriptNameUpdateAsync(): Promise<void> {
  console.log(
    "\x1b[34m",
    "Please enter desired script name or press enter to continue with script name -> ",
    "\x1b[33m",
    config.scriptName,
    "\x1b[0m",
  );
  let scriptName: string = await waitUserInputAsync((ans: string): boolean => {
    return (
      (config.scriptName.length > 0 && ans.length === 0) || (ans.endsWith(".js") && ans.length > 3)
    );
  });

  if (scriptName.length > 0) {
    config.scriptName = scriptName;
    updateEnv("SCRIPT_FILE_NAME", scriptName);
  }
}
