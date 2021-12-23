import readline from "readline";
import { errorMessage, taskerMessage } from "./messages";

export async function waitUserInputAsync(
  testFunc: (answer: string) => boolean
): Promise<string> {
  let readLine: readline.Interface | null = null;
  let answer: string = "";
  let isCorrectAns: boolean = false;

  do {
    readLine = readline.createInterface({
      input: process.stdin,
    });
    answer = await new Promise((resolve) =>
      readLine?.question("", (ans) => {
        readLine?.close();
        resolve(ans.trim());
      })
    );

    isCorrectAns = testFunc(answer);
    if (!isCorrectAns) {
      errorMessage("Please enter correct value");
    }
  } while (!isCorrectAns);
  return answer;
}
