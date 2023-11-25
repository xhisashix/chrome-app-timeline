const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: "./src/ts/popup.ts",
    options: "./src/ts/options.ts",
  },
  output: {
    filename: "./js/[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      // CSS ローダーの設定
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // typescript ローダーの設定
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    // import 文で .ts ファイルを解決するため
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/html/", to: "html" },
        { from: "./src/css/", to: "css" },
        { from: "./src/manifest.json", to: "manifest.json" },
        // { from: "./src/img/", to: "img" },
      ],
    }),
  ],
};
