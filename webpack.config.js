import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { postBuilder } from "./post-build.js";
import { preBuildStart } from "./pre-build.js";

env.config();

const resultScriptName = process.env.SCRIPT_FILE_NAME;
preBuildStart(resultScriptName);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
