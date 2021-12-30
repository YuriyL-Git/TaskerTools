import { waitTaskerConfigAsync } from "../routes/get-tasker-config";
import { config } from "../config/config";
import { updateTypes } from "../update-types/update-types";
import { sendMessageReadyToWebpack } from "../message-sender/message-to-webpack";
import { waitTaskNameUpdateAsync } from "../ui-interface/task-name-menu";
import { waitScriptNameUpdateAsync } from "../ui-interface/script-name-input";
import { waitScriptTypeUpdateAsync } from "../ui-interface/script-type";

interface TaskerData {
  response: string;
  globals: string;
  tasks: string;
}

export async function processInputDataAsync(taskerResponse: string): Promise<void> {
  const taskerData: TaskerData = JSON.parse(taskerResponse) as TaskerData;

  const tasks: string[] = taskerData.tasks.split(",");
  const globals: string[] = taskerData.globals.split(",").map((global) => global.replace("%", ""));

  await waitScriptTypeUpdateAsync();
  await waitTaskNameUpdateAsync(tasks);
  await waitScriptNameUpdateAsync();
  const configData: string = await waitTaskerConfigAsync();

  const locals: string[] = getLocals(configData, config.taskName);

  updateTypes(globals, locals);
}

function getLocals(configData: string, taskName: string): string[] {
  const sectionRegex: RegExp = new RegExp(`<nme>${taskName}<\/nme>(.*?)<\/Task>`);

  const [localsSection = null] = configData.match(sectionRegex) || [];
  const locals: string[] = localsSection?.match(/(?<=%)[a-z_)(]+/g) || [];
  const uniqueLocals: string[] = Array.from(new Set(locals));

  const arrayDuplicates: string[] = uniqueLocals
    .filter((local) => local.includes("()"))
    .map((local) => local.replace("()", "").trim());

  return uniqueLocals.filter((local) => !arrayDuplicates.includes(local));
}
