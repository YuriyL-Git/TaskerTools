import fs from "fs";
import path from "path";
import env from "dotenv";
import http from "http";
import { fileURLToPath } from "url";
import { config } from "../webpack.config.js";

env.config();

const isDevelopment = Boolean(process.env.IS_DEVELOPMENT.trim());
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function postBuilder() {
  const scriptName = config.scriptName;
  
  setTimeout(async () => {
    await updateBuildFileAsync(scriptName);
    messageToTaskerScriptReady(scriptName);
  }, 100);
}

async function updateBuildFileAsync(scriptName) {
  return new Promise(async (resolve, reject) => {
    fs.readFile("dist/" + scriptName, "utf8", async (err, scriptData) => {
      if (err) {
        console.log(err);
        reject();
      }
      const updatedScript = await getUpdatedScript(scriptData);

      fs.writeFile("dist/" + scriptName, updatedScript, (err) => {
        if (err) {
          console.log(err);
          reject();
        }
        successMessage("Bundle updated");
        resolve();
      });
    });
  });
}

async function getUpdatedScript(script) {
  const result = [];
  if (isDevelopment) {
    result.push(getConsoleLogFunc());
  }

  const localsDeclaration = await getLocalsDeclarations();
  const formattedScript = script.replace(/[a-zA-Z0-9_]+\.locals\./g, "");
  if (localsDeclaration.length > 0) {
    result.push(localsDeclaration);
  }

  result.push(formattedScript);

  return result.join("\n");
}

async function getLocalsDeclarations() {
  function getLocalDeclaration(variableName) {
    if (isDevelopment) {
      return `if (local("${variableName}") == "undefined") { var ${variableName} = null} else {throw Error("Variable ${variableName} already declared in tasker")};`;
    } else {
      return `var ${variableName} = null;`;
    }
  }

  return await new Promise((resolve) => {
    fs.readFile(
      root + "/src/declarations/declarations.ts",
      "utf8",
      (err, data) => {
        const result = data
          .match(/[a-z_]+(?=:)/gi)
          ?.map((variable) => {
            if (variable.toLowerCase() !== variable) {
              errorMessage(
                "Local variables for tasker always should be lover case!! \n" +
                  `Please correct variable => ${variable}`
              );
              throw Error();
            }
            return getLocalDeclaration(variable);
          })
          ?.join("\n");
        resolve(result || "");
      }
    );
  });
}

function getConsoleLogFunc() {
  const devServerAddress = `http://${config.devServerAddress}`;

  const requestUrlContent = `const requestUrl = '${devServerAddress}/consolelog';`;
  const taskerContent =
    "console.log = function(...args) {const data = new FormData(); data.append('message', args.join(''));" +
    " fetch(requestUrl, { method: 'POST', body: data }); wait(1); };";
  const autoJsFuncContent =
    `console.log = function() { const params = arguments; const message = Object.keys(params).map((key) => params[key]).join();
 const options = {headers: { 'Content-Type': 'application/x-www-form-urlencoded' },body: message};` +
    `$http.post(requestUrl, options);` +
    "sleep(1);};";

  const functionContent = config.isAutoJs ? autoJsFuncContent : taskerContent;
  return [requestUrlContent, functionContent].join("\n");
}

function messageToTaskerScriptReady(scriptName) {
  const taskerAddress = `http://${config.taskerIp}:${config.taskerPort}/?`;

  http.get(taskerAddress + "scriptready=" + scriptName).on("error", (err) => {
    errorMessage("Error: " + err.message);
  });
}

function errorMessage(message) {
  console.log("\x1b[31m", message);
  console.log("\x1b[0m", "");
}

function successMessage(message) {
  console.log("\x1b[32m", message);
  console.log("\x1b[0m", "");
}
