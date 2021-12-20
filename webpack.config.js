import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { postBuilder } from "./post-build.js";
import { preBuildStart, uploadFile } from "./pre-build.js";

env.config();

const resultScriptName = process.env.SCRIPT_FILE_NAME;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//await uploadFile(resultScriptName);

function waitSomeTime() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 15000);
  });
}

await waitSomeTime();

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
