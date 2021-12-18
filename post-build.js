import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadFile } from "./pre-build.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url)) + "/dist/";

export function postBuilder(fileName) {
  setTimeout(async () => {
    await updateBuildFile(fileName);
    await uploadFile(fileName);
  }, 100);
}

async function getLocalVariables() {
  function getVariableCondition(variable, variableVal) {
    return `if (local("${variable}") == "undefined") { \n  var ${variable} = ${variableVal} \n} else { \n  ${variable} =
     ${variableVal} \n}; \n`;
  }

  return new Promise((resolve) => {
    fs.readFile(
      "src/type-declarations/declared-locals.ts",
      "utf8",
      (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        const result = data
          .split("\n")
          .filter((line) => line.includes(":") && line.includes(","))
          .map((line) => {
            const varData = line.split(":");
            const variable = varData[0].trim();
            if (variable.toLowerCase() !== variable) {
              errorMessage(
                "Local variables for tasker always should be lover case!!"
              );
              throw Error();
            }
            const variableVal = varData[1].replace(",", "").trim();
            return getVariableCondition(variable, variableVal);
          })
          .join("\n");
        resolve(result);
      }
    );
  });
}

async function updateBuildFile(fileName) {
  return new Promise(async (resolve) => {
    fs.readFile("dist/" + fileName, "utf8", async (err, data) => {
      if (err) {
        return errorMessage(err);
      }
      const updatedData = await getUpdatedFileData(data);

      fs.writeFile("dist/" + fileName, updatedData, (err) => {
        if (err) {
          return errorMessage(err);
        }
        successMessage("Bundle updated");
        resolve();
      });
    });
  });
}

async function getUpdatedFileData(data) {
  const locals = await getLocalVariables();
  let result = data.replace(/tasker_variables_1\.locals\./g, "");

  return locals + "\n" + result;
}

function errorMessage(message) {
  console.log("\x1b[31m", message);
  console.log("\x1b[0m", "");
}

function successMessage(message) {
  console.log("\x1b[32m", message);
  console.log("\x1b[0m", "");
}
