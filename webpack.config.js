import path from "path";
import { fileURLToPath } from "url";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import waitServerReadyAsync from "./webpack/wait-node-response.js";
import { postBuilder } from "./webpack/post-builder.js";

const scriptName = await waitServerReadyAsync();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: "production",
  entry: "./src/index.ts",
  optimization: {
    minimize: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: scriptName,
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
          postBuilder(scriptName);
        });
      },
    },
    new CleanWebpackPlugin(),
  ],
};
