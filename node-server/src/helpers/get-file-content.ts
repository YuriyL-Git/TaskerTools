import fs from 'fs';
import { errorMessage } from './messages';

export async function getFileContent(fileRelativePath: string = "") {
  return new Promise<string>((resolve, reject) => {
    fs.readFile("public/foo.bundler.js", "utf8", async (err, data) => {
      if (err) {
        errorMessage(err.toString());
        reject();
      }

      resolve(data);
    });
  });
}
