import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import https from "https";
import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

env.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = "token.json";
const folderId = process.env.SCRIPT_FOLDER_GOOGLE_DRIVE.trim();
const scriptFileId = process.env.SCRIPT_FILE_GOOGLE_DRIVE_ID.trim();
const taskerBackupFileId =
  process.env.TASKER_BACKUP_FILE_GOOGLE_DRIVE_ID.trim();

const autoRemoteKey = process.env.AUTO_REMOTE_KEY;
const FILE_UPLOADED_MSG_PREFIX = "scriptReady=:=";
const GET_TASKER_DATA_MSG_PREFIX = "getTaskerData=:=";
const DOWNLOAD_TIMEOUT = process.env.TIMEOUT_BEFORE_DOWNLOAD.trim();

const autoRemoteUrl =
  "https://autoremotejoaomgcd.appspot.com/sendmessage?key=" +
  autoRemoteKey +
  "&message=";

export function uploadFile(fileName) {
  function upload(auth) {
    const drive = google.drive({ version: "v3", auth });

    const media = {
      mimeType: "text/javascript",
      body: fs.createReadStream("dist/" + fileName),
      name: fileName,
    };

    drive.files.update(
      {
        fileId: scriptFileId,
        media: media,
      },
      (err, res) => {
        if (err) {
          errorMessage("The google API returned an error: " + err);
          createEmptyFile(fileName);

          console.log(
            "Please update env variable SCRIPT_FILE_GOOGLE_DRIVE_ID using fileID of this file"
          );
          console.log();
          return;
        }
        sendAutoRemoteMessage(
          FILE_UPLOADED_MSG_PREFIX,
          fileName,
          "Script file uploaded to google drive"
        );
      }
    );
  }

  processAction(upload);
}

export function downloadTaskerData() {
  function download(auth) {
    const drive = google.drive({ version: "v3", auth });
    const dest = fs.createWriteStream(
      path.resolve(__dirname, "tasker_helpers/tasker_data.txt")
    );

    drive.files.get(
      {
        fileId: taskerBackupFileId,
        alt: "media",
      },
      { responseType: "stream" },
      (err, dataresult) => {
        const data = dataresult?.data;
        if (data === undefined) {
          createEmptyFile("tasker_data.txt");
          console.log(
            "Please update env variable TASKER_BACKUP_FILE_GOOGLE_DRIVE_ID using fileID of this file"
          );
          console.log();
          return;
        }
        if (err) {
          errorMessage(err);

          return;
        }
        data
          .on("end", () =>
            successMessage("Tasker backup file updated from google drive")
          )
          .on("error", (err) => {
            errorMessage(
              "Tasker updating backup from google drive failed! ",
              err
            );
            return process.exit();
          })
          .pipe(dest);
      }
    );
  }

  sendAutoRemoteMessage(
    GET_TASKER_DATA_MSG_PREFIX,
    "",
    "Getting tasker date updates ..."
  );

  setTimeout(() => {
    processAction(download);
  }, DOWNLOAD_TIMEOUT);
}

export function createEmptyFile(name) {
  function createFile(auth) {
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: name,
      parents: [folderId],
    };
    const media = {
      mimeType: "text/plain",
      body: "placeholder",
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      function (err, file) {
        if (err) {
          errorMessage("Error during creating file ", name, " ", err);
        } else {
          console.log();
          console.log(`!!!    Was created new file ${fileName}   !!!`);
        }
      }
    );
  }

  processAction(createFile);
}

function processAction(actionCallback) {
  fs.readFile("credentials.json", (err, content) => {
    if (err) {
      return errorMessage("Error loading client secret file:", err);
    }
    authorize(JSON.parse(content), actionCallback);
  });
}

function sendAutoRemoteMessage(prefix, message, resultMessage) {
  https
    .get(autoRemoteUrl + prefix + message, () => {
      successMessage(resultMessage);
    })
    .on("error", (err) => {
      errorMessage("Error: " + err.message);
    });
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getAccessToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return errorMessage("Error retrieving access token", err);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          return errorMessage(err);
        }
        successMessage("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
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
