import dotenv from "dotenv";
import { waitUserInput } from "../helpers/wait-user-input";
import { updateEnv } from "../helpers/update-env";
import { highlightMessage, taskerMessage } from "../helpers/messages";
import { waitTaskerConfig } from "../routes/get-tasker-config";

dotenv.config({ path: "../.env" });

const savedTaskName: string = (process.env.TASK_NAME || "")
  .toUpperCase()
  .trim();
const savedScriptName: string = (process.env.SCRIPT_FILE_NAME || "").trim();

interface TaskerData {
  response: string;
  globals: string;
  tasks: string;
}

export async function processInputData(taskerResponse: string): Promise<void> {
  const taskerData: TaskerData = JSON.parse(taskerResponse) as TaskerData;
  const tasks: string[] = taskerData.tasks.split(",");
  const globals: string[] = taskerData.globals
    .split(",")
    .map((global) => global.replace("%", ""));

  const savedTaskNumber: number = getSavedTaskNumber(tasks);
  printTasksList(tasks, savedTaskNumber);
  const currTaskName: string = await processTaskNameUserInput(
    tasks,
    savedTaskNumber
  );
  await processScriptNameUserInput();
  const configData: string = await waitTaskerConfig();
  getLocals(configData, currTaskName);
  //const localsSection;
  //console.log(configData);
}

function printTasksList(tasks: string[], savedTaskIndex: number): void {
  tasks.forEach((task, index) => {
    const spacesNumber: number =
      Math.floor(tasks.length / 10) - Math.floor((index + 1) / 10);
    const taskToPrint: string =
      `${index + 1}. ` + " ".repeat(spacesNumber) + task;

    if (index === savedTaskIndex) {
      console.log("\x1b[33m", taskToPrint);
    } else {
      console.log("\x1b[0m", taskToPrint);
    }
  });
}

function getSavedTaskNumber(tasks: string[]): number {
  let savedTaskNumber: number = tasks
    .map((task) => task.toUpperCase())
    .indexOf(savedTaskName);
  if (savedTaskNumber === -1) {
    savedTaskNumber = 0;
  }
  return savedTaskNumber;
}

async function processTaskNameUserInput(
  tasks: string[],
  savedTaskNumber: number
): Promise<string> {
  console.log();
  taskerMessage(
    "Please enter the number of task or press enter to continue with selected task",
    false
  );
  const taskNumberAnswer: string = await waitUserInput(
    (ans: string): boolean => {
      const taskNumber: number = Number(ans);
      return (
        (Number.isInteger(taskNumber) &&
          taskNumber <= tasks.length &&
          taskNumber > 0) ||
        ans === ""
      );
    }
  );

  let currTaskName: string = tasks[savedTaskNumber];

  const taskNumber: number = Number(taskNumberAnswer);
  if (taskNumber > 0) {
    currTaskName = tasks[taskNumber - 1];
    updateEnv("TASK_NAME", currTaskName);
  }
  return currTaskName;
}

async function processScriptNameUserInput(): Promise<void> {
  console.log(
    "\x1b[34m",
    "Please enter desired script name or press enter to continue with script name -> ",
    "\x1b[33m",
    savedScriptName,
    "\x1b[0m"
  );
  let scriptNameAnswer: string = await waitUserInput((ans: string): boolean => {
    return (
      (savedScriptName.length > 0 && ans.length === 0) ||
      (ans.endsWith(".js") && ans.length > 3)
    );
  });

  if (scriptNameAnswer.length === 0) {
    scriptNameAnswer = savedScriptName;
  }

  updateEnv("SCRIPT_FILE_NAME", scriptNameAnswer);
}

//
function getLocals(configData: string, taskName: string) {
  const sectionRegex: RegExp = new RegExp(
    `<nme>${taskName}<\/nme>(.*?)<\/Task>`
  );
  const [localsSection = null] = configData.match(sectionRegex) || [];
  //console.log(localsSection);
  const locals: string[] = localsSection?.match(/%[a-z_]+/g) || [];

  console.log(locals);

  // console.log("LOCALS", localsSection);
}
