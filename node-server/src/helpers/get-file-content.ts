import fs from "fs";
import { errorMessage } from "./messages";

export async function getFileContent(fileRelativePath: string = "") {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(fileRelativePath, "utf8", async (err, data) => {
      if (err) {
        errorMessage(err.toString());
        reject();
      }
      resolve(data);
    });
  });
}
