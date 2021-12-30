import { waitUserInputAsync } from "../helpers/wait-user-input";
import { updateEnv } from "../helpers/update-env";
import { waitTaskerConfigAsync } from "../routes/get-tasker-config";
import { config } from "../config/config";
import { updateTypes } from "../update-types/update-types";
import { sendMessageReadyToWebpack } from "../message-sender/message-to-webpack";
import { waitTaskNameUpdateAsync } from "../ui-interface/task-name-menu";
import { waitScriptNameUpdateAsync } from "../ui-interface/script-name-input";

/*dotenv.config({ path: ENV_PATH });*/

/*
const savedScriptName: string = (process.env.SCRIPT_FILE_NAME || "").trim();

export const scriptData: { name: string } = {
  name: savedScriptName,
};
*/

interface TaskerData {
  response: string;
  globals: string;
  tasks: string;
}

export async function processInputDataAsync(taskerResponse: string): Promise<void> {
  const taskerData: TaskerData = JSON.parse(taskerResponse) as TaskerData;

  const tasks: string[] = taskerData.tasks.split(",");
  const globals: string[] = taskerData.globals.split(",").map((global) => global.replace("%", ""));

  await waitTaskNameUpdateAsync(tasks);
  await waitScriptNameUpdateAsync();
  const configData: string = await waitTaskerConfigAsync();

  const locals: string[] = getLocals(configData, config.taskName);

  updateTypes(globals, locals);
  sendMessageReadyToWebpack();
}

/*function printTasksList(tasks: string[], savedTaskIndex: number): void {
  tasks.forEach((task, index) => {
    const spacesNumber: number = Math.floor(tasks.length / 10) - Math.floor((index + 1) / 10);
    const taskToPrint: string = `${index + 1}. ` + " ".repeat(spacesNumber) + task;

    if (index === savedTaskIndex) {
      console.log("\x1b[34m", taskToPrint);
    } else {
      console.log("\x1b[0m", taskToPrint);
    }
  });
}

async function waitTaskNameAsync(tasks: string[], savedTaskNumber: number): Promise<string> {
  console.log();
  /!*  taskerMessage(
      "Please enter the number of task or press enter to continue with selected task",
      false,
    );*!/
  const taskNumberAnswer: string = await waitUserInputAsync((ans: string): boolean => {
    const taskNumber: number = Number(ans);
    return (
      (Number.isInteger(taskNumber) && taskNumber <= tasks.length && taskNumber > 0) || ans === ""
    );
  });

  let currTaskName: string = tasks[savedTaskNumber];

  const taskNumber: number = Number(taskNumberAnswer);
  if (taskNumber > 0) {
    currTaskName = tasks[taskNumber - 1];
    updateEnv("TASK_NAME", currTaskName);
  }
  return currTaskName;
}*/

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
