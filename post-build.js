import fs from "fs";
import { uploadFile } from "./pre-build.js";

export function postBuilder(fileName) {
  setTimeout(async () => {
    await updateBuildFile(fileName);
    await uploadFile(fileName);
  }, 100);
}

async function getLocalVariablesDeclaration() {
  function getVariableCondition(variable, variableVal) {
    return `if (local("${variable}") == "undefined") { var ${variable} = ${variableVal} };`;
  }

  const declaredLocals = await new Promise((resolve, reject) => {
    fs.readFile("src/declarations/declared-locals.ts", "utf8", (err, data) => {
      if (err) {
        errorMessage(err);
        reject();
      }

      const result = data
        .split("\n")
        .filter((line) => line.includes(":") && line.includes(","))
        .map((line) => {
          const varData = line.split(":");
          const variable = varData[0].trim();
          if (variable.toLowerCase() !== variable) {
            errorMessage(
              "Local variables for tasker always should be lover case!! \n" +
                `Please correct variable => ${variable}`
            );
            throw Error();
          }
          const variableVal = varData[1].replace(",", "").trim();
          return getVariableCondition(variable, variableVal);
        })
        .join("\n");
      resolve(result);
    });
  });

  const taskerLocals = await new Promise((resolve, reject) => {
    fs.readFile("tasker/tasker-locals.inf", "utf8", (err, data) => {
      if (err) {
        errorMessage(err);
        reject();
      }

      const result = data
        .split(" ")
        .map((variable) => getVariableCondition(variable, '""'))
        .join("\n");
      resolve(result);
    });
  });
  return declaredLocals + "\n" + taskerLocals;
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
  const locals = await getLocalVariablesDeclaration();
  let result = data.replace(/[a-zA-Z]+\.locals\./g, "");

  return locals + "\n" + result;
}

export function errorMessage(message) {
  console.log("\x1b[31m", message);
  console.log("\x1b[0m", "");
}

export function successMessage(message) {
  console.log("\x1b[32m", message);
  console.log("\x1b[0m", "");
}
