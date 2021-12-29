import inquirer from "inquirer";

export async function waitTaskName(tasks: string[], defaultTask: number): Promise<string> {
  const tasksToPrint: string[] = tasks.map((task, index) => ++index + " " + task);

  const { taskName } = await inquirer.prompt([
    {
      type: "list",
      pageSize: 25,
      name: "taskName",
      message: "Select task name \n",
      choices: tasksToPrint,
      default: defaultTask,
    },
  ]);

  return taskName.replace(/^\d+/, "").trim();
}
