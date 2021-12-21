import readline from "readline";
import { taskerMessage } from "./messages";

export function waitUserInput(message: string): Promise<string> {
  console.log();

  taskerMessage(message);

  const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    readLine.question("", (ans) => {
      readLine.close();
      resolve(ans.trim());
    })
  );
}
