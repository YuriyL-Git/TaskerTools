import inquirer from "inquirer";
import dotenv from "dotenv";
import { config, ENV_PATH } from "../config/config";
import { updateEnv } from "../helpers/update-env";

dotenv.config({ path: ENV_PATH });

export async function waitTaskNameUpdateAsync(tasks: string[]): Promise<void> {
  const tasksToPrint: string[] = tasks.map((task, index) => ++index + " " + task);

  const defaultTask: number = getSavedTaskNumber(tasks);
  let { taskName } = await inquirer.prompt([
    {
      type: "list",
      pageSize: 25,
      name: "taskName",
      message: "Select task name \n",
      choices: tasksToPrint,
      default: defaultTask,
    },
  ]);
  taskName = taskName.replace(/^\d+/, "").trim();

  if (taskName != config.taskName) {
    config.taskName = taskName;
    updateEnv("TASK_NAME", taskName);
  }
}

function getSavedTaskNumber(tasks: string[]): number {
  const savedTaskNumber: number = tasks.indexOf(config.taskName);
  return savedTaskNumber === -1 ? 0 : savedTaskNumber;
}
