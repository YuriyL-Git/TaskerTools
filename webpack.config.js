import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { downloadTaskerData, uploadFile } from "./googleDrive.js";

env.config();
downloadTaskerData();

const resultScriptName = process.env.SCRIPT_FILE_NAME;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: resultScriptName,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
          uploadFile(resultScriptName);
        });
      },
    },
  ],
};
