import { errorMessage } from "../helpers/messages";
import { waitTaskerConfig } from "../routes/get-tasker-config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: "../.env" });
const scriptName = process.env.SCRIPT_FILE_NAME;

interface localData {
  locals: Set<string>;
  task: string;
}

interface ITaskerData {
  globals: Set<string>;
  locals: Array<localData>;
}

export async function processTaskerConfig(): Promise<void> {
  try {
    const configLines: string[] = JSON.stringify(
      await waitTaskerConfig()
    ).split("\\n");

    processConfigContent(configLines);
  } catch (error) {
    errorMessage("Tasker config request failed with error " + error);
  }
}

function processConfigContent(configLines: string[]) {
  function formatVar(variable: string): string {
    return variable.replace(/>%/, "").replace(/</, "");
  }

  function getGlobal(matchResult: string[]): string {
    if (matchResult.length > 0) {
      let global: string = matchResult[0];
      if (global.toLowerCase() !== global) {
        return formatVar(global);
      }
    }
    return "";
  }

  function getLocal(matchResult: string[]): string {
    if (matchResult.length > 0) {
      let local: string = matchResult[0];
      if (local.toLowerCase() === local) {
        return formatVar(local);
      }
    }
    return "";
  }

  const taskerData: ITaskerData = {
    locals: new Set(),
    globals: new Set(),
    tasknames: new Set(),
  };

  configLines.forEach((line) => {
    const variablesMatch: string[] = line.match(/>%[a-z_]+</i) || [];

    taskerData.globals.add(getGlobal(variablesMatch));
    taskerData.locals.add(getLocal(variablesMatch));

    const moreLocals: string[] = line.match(/%[a-z_]+$/gm) || [];
    if (moreLocals.length > 0) {
      const local: string = moreLocals[0].replace(/%/, '"') + '"';
      taskerData.locals.add(local);
    }
    /*     .forEach((variable) => resultsSet.add(variable.replace(/%/, '"') + '"'));
       // console.log();*/
  });
  console.log(taskerData);
}

/*function processConfigContent(configContent: string): void {
  let localVars: string[] = [];
  const globalVars: string[] = [];

  getVariables(configContent).forEach((variable: string) => {
    if (variable.toLowerCase() !== variable) {
      globalVars.push(variable);
    }
  });

  const taskData = configContent
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

function getVariables(configContent: string, isLocal = false) {
  const resultsSet = new Set();
  configContent.match(/>%.+</g)?.forEach((variable: string) => {
    if (variable.includes("(") || variable.includes(")")) {
      return;
    }
    resultsSet.add(variable.replace(/>%/, '"').replace(/</, '"'));
  });

  if (isLocal) {
    configContent
      .match(/%.+$/gm)
      ?.forEach((variable: string) =>
        resultsSet.add(variable.replace(/%/, '"') + '"')
      );
  }
  return resultsSet;
}

function saveLocalsToFile(locals: string) {
  fs.writeFile(path.resolve(__dirname, "tasker-locals.inf"), locals, (err) => {
    if (err) {
      return errorMessage(err.toString());
    }
  });
}*/
