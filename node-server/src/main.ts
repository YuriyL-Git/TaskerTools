import express from "express";
import dotenv from "dotenv";
import fileupload from "express-fileupload";
import ip from "ip";
import * as fs from "fs";
import { errorMessage } from "./helpers/messages";
import { getFileContent } from "./helpers/get-file-content";

dotenv.config();

const PORT: number = Number(process.env.PORT || 4000);
const hostIp = ip.address();

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(`${__dirname}/public`));
app.use(fileupload());
app.use(express.static("files"));

app.get("/script", async (req, res) => {
  const scriptContent = await getFileContent();
  res.send(scriptContent);
});

/*app.post('/user', (req, res) => {
  console.log("REQUEST");
  res.send('result message');
});*/

app.listen(PORT, hostIp, () => {
  console.log("Server started on address: ", hostIp + ":" + PORT);
});
