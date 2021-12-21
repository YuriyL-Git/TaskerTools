import dotenv from "dotenv";
import { waitUserInput } from "../helpers/wait-user-input";
import { updateEnv } from "../helpers/update-env";

dotenv.config({ path: "../.env" });

const savedTaskName: string = (process.env.TASK_NAME || "")
  .toUpperCase()
  .trim();

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
  const userAnswer: string = await waitUserInput(
    "Please enter the number of task to continue with or press enter to continue with selected task"
  );
  if (userAnswer === "") {
    console.log("EMPTY ANSWER");
  } else {
    console.log("userAnswer", userAnswer);
    const taskNumber: number = Number(userAnswer);
    if (
      Number.isInteger(taskNumber) &&
      taskNumber <= tasks.length &&
      taskNumber > 0
    ) {
      updateEnv("TASK_NAME", tasks[taskNumber - 1]);
    }
  }
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
