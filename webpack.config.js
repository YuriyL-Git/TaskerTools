import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
/*import { postBuilder } from "./post-build.js";
import { preBuildStart, uploadFile } from "./pre-build.js";*/
import { waitServerReadyAsync } from "./webpack-helpers/wait-node-response.js";

//await waitServerReady();

env.config();
const resultScriptName = process.env.SCRIPT_FILE_NAME;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//await uploadFile(resultScriptName);

//preBuildStart(resultScriptName);

export default {
  mode: "production",
  entry: "./src/index.ts",
  optimization: {
    minimize: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: resultScriptName,
  },
  resolve: {
    extensions: [".ts", ".js", ".d.ts"],
    alias: {
      tasker: path.join(__dirname, "./tasker"),
      locals: path.join(__dirname, "./tasker/types"),
    },
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
          // postBuilder(resultScriptName);
        });
      },
    },
  ],
};
