import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { postBuilder } from "./post-build.js";
import { preBuildStart, uploadFile } from "./pre-build.js";
import { waitNodeServerResponse } from "./webpack-helpers/wait-node-response.js";

//await waitNodeServerResponse();

env.config();
const resultScriptName = process.env.SCRIPT_FILE_NAME;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//await uploadFile(resultScriptName);

preBuildStart(resultScriptName);

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
          postBuilder(resultScriptName);
        });
      },
    },
  ],
};
