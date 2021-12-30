import { waitScriptTypeAsync } from "./script-type";
import { waitTaskNameAsync } from "./task-name";
import { waitScriptNameAsync } from "./script-name";
import { waitIsAutoRestartAsync } from "./auto-restart";

export async function waitUserInputs(tasks: string[]): Promise<void> {
  await waitScriptTypeAsync();
  await waitIsAutoRestartAsync();
  await waitTaskNameAsync(tasks);
  await waitScriptNameAsync();
}
