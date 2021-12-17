import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import https from "https";
import env from "dotenv";

env.config();

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = "token.json";
const autoRemoteKey = process.env.AUTO_REMOTE_KEY;
const gdFileId = process.env.SCRIPT_FILE_GOOGLE_DRIVE_ID;

const autoRemoteUrl =
  "https://autoremotejoaomgcd.appspot.com/sendmessage?key=" +
  autoRemoteKey +
  "&message=";

export function UploadFile(name) {
  var fileName = name;

  function upload(auth) {
    const drive = google.drive({ version: "v3", auth });

    const media = {
      mimeType: "text/javascript",
      body: fs.createReadStream("dist/" + fileName),
      name: fileName,
    };
    const body = { name: fileName };
    drive.files.update(
      {
        fileId: gdFileId,
        media: media,
        resource: body,
      },
      (err, res) => {
        if (err) {
          return console.log("The google API returned an error: " + err);
        }
        sendAutoRemoteMessage(fileName);
      }
    );
  }

  fs.readFile("credentials.json", (err, content) => {
    if (err) {
      return console.log("Error loading client secret file:", err);
    }
    authorize(JSON.parse(content), upload);
  });
}

function sendAutoRemoteMessage(fileName) {
  https
    .get(autoRemoteUrl + fileName, (resp) => {
      console.log("File uploaded to google drive");
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
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
        return console.error("Error retrieving access token", err);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
