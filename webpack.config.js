import path from "path";
import { fileURLToPath } from "url";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import waitConfigFromServerAsync from "./webpack/wait-config-from-server.js";
import { postBuilder } from "./webpack/post-builder.js";

export const config = await waitConfigFromServerAsync();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: "production",
  entry: "./src/index.ts",
  optimization: {
    minimize: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: config.scriptName,
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
          postBuilder();
        });
      },
    },
    new CleanWebpackPlugin(),
  ],
};
