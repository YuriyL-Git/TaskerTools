import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { errorMessage } from "../post-build.js";

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

  if (!taskData) {
    errorMessage(
      `Please connect script ${resultScriptName}  to required task on tasker app and restart watcher \n`
    );
    return;
  }

  getVariables(taskData, true).forEach((variable) => {
    if (variable.toLowerCase() === variable) {
      localVars.push(variable);
    }
  });

  const importLine =
    'import { declaredLocals, IDeclaredLocals } from "../src/variable-declarations/declared-locals"; \n' +
    'import {UserDeclaredGlobals } from "../src/variable-declarations/declared-globals";\n' +
    'import { GeneralGlobals } from "./general-globals"; \n';

  const localTypes =
    "export type LocalVars = \n" +
    localVars.map((localVar) => "  | " + localVar).join("\n") +
    "; \n";

  const globalTypes =
    "export type GlobalVars = \n" +
    globalVars.map((globalVar) => "  | " + globalVar).join("\n") +
    "\n  | UserDeclaredGlobals \n  | GeneralGlobals; \n";

  localVars = [...localVars, "err", "errmsg", "priority", "qtime", "caller"];
  localVars = localVars.map((localVar) => localVar.replace(/"/g, ""));
  saveLocalsToFile(localVars.join(" "));

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

function saveLocalsToFile(locals) {
  fs.writeFile(path.resolve(__dirname, "tasker-locals.inf"), locals, (err) => {
    if (err) {
      return errorMessage(err);
    }
  });
}
