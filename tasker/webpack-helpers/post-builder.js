import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import env from "dotenv";

env.config();
const isDevelopment = Boolean(process.env.IS_DEVELOPMENT.trim());

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

export function postBuilder(fileName) {
  setTimeout(async () => {
    await updateBuildFileAsync(fileName);
    //await messageScriptReady(fileName);
  }, 100);
}

async function updateBuildFileAsync(fileName) {
  console.log("DIRR NAME =", root);
  console.log("DEVELOP", Boolean(isDevelopment));

  return new Promise(async (resolve, reject) => {
    fs.readFile("dist/" + fileName, "utf8", async (err, scriptData) => {
      if (err) {
        console.log(err);
        reject();
      }
      const updatedScript = await getUpdatedScript(scriptData);

      fs.writeFile("dist/" + fileName, updatedScript, (err) => {
        if (err) {
          console.log(err);
          reject();
        }
        console.log("Bundle updated");
        resolve();
      });
    });
  });
}

async function getUpdatedScript(script) {
  const localsDeclaration = await getLocalsDeclarations();
  const formattedScript = script.replace(/[a-zA-Z0-9_]+\.locals\./g, "");

  return localsDeclaration + "\n" + formattedScript;
}

async function getLocalsDeclarations() {
  function getLocalDeclaration(variableName) {
    if (isDevelopment) {
      return `if (local("${variableName}") == "undefined") { var ${variableName} = null} else {throw Error("Variable ${variableName} already declared in tasker")};`;
    } else {
      return `var ${variableName} = null;`;
    }
  }

  const declaredLocals = await new Promise((resolve) => {
    fs.readFile(
      root + "/src/declarations/declarations.ts",
      "utf8",
      (err, data) => {
        const result = data
          .match(/[a-z_]+(?=:)/gi)
          .map((variable) => {
            if (variable.toLowerCase() !== variable) {
              errorMessage(
                "Local variables for tasker always should be lover case!! \n" +
                  `Please correct variable => ${variable}`
              );
              throw Error();
            }
            return getLocalDeclaration(variable);
          })
          .join("\n");
        resolve(result);
      }
    );
  });

  console.log("Declarations", declaredLocals);

  /* const taskerLocals = await new Promise((resolve, reject) => {
     fs.readFile("tasker/tasker-locals.inf", "utf8", (err, data) => {
       if (err) {
         errorMessage(err);
         reject();
       }

       const result = data
         .split(" ")
         .map((variable) => getLocalDeclaration(variable, '""'))
         .join("\n");
       resolve(result);
     });
   });
   return declaredLocals + "\n" + taskerLocals;*/
}

function errorMessage(message) {
  console.log("\x1b[31m", message);
  console.log("\x1b[0m", "");
}

function successMessage(message) {
  console.log("\x1b[32m", message);
  console.log("\x1b[0m", "");
}
