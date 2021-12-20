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

  console.log("tasks ss", tasks);
  console.log("globals", globals);
}
