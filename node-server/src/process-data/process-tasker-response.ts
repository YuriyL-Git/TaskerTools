import dotenv from "dotenv";
import { waitUserInput } from "../helpers/wait-user-input";
import { updateEnv } from "../helpers/update-env";
import { highlightMessage, taskerMessage } from "../helpers/messages";

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

export async function processTaskerResponse(
  taskerResponse: string
): Promise<void> {
  const taskerData: TaskerData = JSON.parse(taskerResponse) as TaskerData;
  const tasks: string[] = taskerData.tasks.split(",");
  const globals: string[] = taskerData.globals
    .split(",")
    .map((global) => global.replace("%", ""));

  printTasksList(tasks);

  await processTaskNumberInput(tasks);
  await processScriptNameInput();
  console.log("SUCCESS");
}

function printTasksList(tasks: string[]): void {
  let savedTaskIndex: number = tasks
    .map((task) => task.toUpperCase())
    .indexOf(savedTaskName);
  if (savedTaskIndex === -1) {
    savedTaskIndex = 0;
  }

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

async function processTaskNumberInput(tasks: string[]): Promise<void> {
  console.log();
  taskerMessage(
    "Please enter the number of task or press enter to continue with selected task"
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

  const taskNumber: number = Number(taskNumberAnswer);
  if (taskNumber > 0) {
    updateEnv("TASK_NAME", tasks[taskNumber - 1]);
  }
}

async function processScriptNameInput(): Promise<void> {
  console.log();
  taskerMessage(
    "Please enter desired script name or press enter to continue with script name -> ",
    false
  );
  highlightMessage(savedScriptName, true);
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
