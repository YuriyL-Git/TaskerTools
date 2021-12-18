import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function processVariables(resultScriptName) {
  fs.readFile(
    path.resolve(__dirname, "tasker_data.txt"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      processFile(data, resultScriptName);
    }
  );
}

function getVariables(string, isLocal = false) {
  const resultsSet = new Set();
  string.match(/>%.+</g).forEach((variable) => {
    if (variable.includes("(") || variable.includes(")")) {
      return;
    }
    resultsSet.add(variable.replace(/>%/, '"').replace(/</, '"'));
  });

  if (isLocal) {
    string
      .match(/%.+$/gm)
      .forEach((variable) => resultsSet.add(variable.replace(/%/, '"') + '"'));
  }
  return resultsSet;
}

function processFile(fileData, resultScriptName) {
  let localVars = [];
  const globalVars = [];

  getVariables(fileData).forEach((variable) => {
    if (variable.toLowerCase() !== variable) {
      globalVars.push(variable);
    }
  });
  const taskData = fileData
    .split("<Task sr=")
    .find((task) => task.includes(resultScriptName));

  getVariables(taskData, true).forEach((variable) => {
    if (variable.toLowerCase() === variable) {
      localVars.push(variable);
    }
  });

  const importLine =
    'import { declaredLocals, IDeclaredLocals } from "../src/type-declarations/declared-locals";';

  const localTypes =
    "export type LocalVars = \n" +
    localVars.map((localVar) => "  | " + localVar).join("\n") +
    "; \n";

  const globalTypes =
    "export type GlobalVars = \n" +
    globalVars.map((globalVar) => "  | " + globalVar).join("\n") +
    "; \n";

  localVars = localVars.map((localVar) => localVar.replace(/"/g, ""));

  let interfaceLocals = "interface ITaskerLocals {" + "\n";
  localVars.forEach(
    (localVar) => (interfaceLocals += `  ${localVar}: string; \n`)
  );
  interfaceLocals += "} \n";

  let objectLocals = "const taskerLocals: ITaskerLocals = {" + "\n";
  localVars.forEach((localVar) => (objectLocals += `  ${localVar}: "", \n`));
  objectLocals += "}; \n";

  const constLocals =
    "export const locals: ITaskerLocals & IDeclaredLocals = { \n" +
    "...taskerLocals, \n" +
    "...declaredLocals, \n" +
    "}; \n";

  const variablesData = [
    importLine,
    localTypes,
    globalTypes,
    interfaceLocals,
    objectLocals,
    constLocals,
  ].join("\n");

  fs.writeFile(
    path.resolve(__dirname, "tasker-variables.ts"),
    variablesData,
    (err) => {
      if (err) {
        return console.error(err);
      }
    }
  );
}
