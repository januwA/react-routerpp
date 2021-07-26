import path = require("path");
import * as webpack from "webpack";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

import util from "./util";

const devConfig: webpack.Configuration = {
  mode: "development",
  devtool: "eval",
  entry: {
    main: path.resolve(__dirname, "../../examples", "index"),
  },
  output: {
    path: util.output,
    filename: `[name].js`,
    chunkFilename: "[name].js",
    library: {
      type: "module",
    },
    chunkLoading: "import",
    chunkFormat: "module",
    environment: {
      module: true,
    },
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        // See also: https://github.com/microsoft/TypeScript-Babel-Starter
        // 如果你想要.d.ts文件，那么ts-loader可能来的更直接点
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.join(
                util.rootPath,
                process.env.NODE_ENV === "production"
                  ? "tsconfig.types.json"
                  : "tsconfig.json"
              ),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, "../../examples/index.html"),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      path: "path-browserify",
    },
  },
  experiments: {
    outputModule: true,
  },
};

export default [devConfig];
