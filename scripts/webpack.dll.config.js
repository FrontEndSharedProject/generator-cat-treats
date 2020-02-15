const path = require("path");
const webpack = require("webpack");
const Config = require("webpack-chain");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const config = new Config();
const dllPath = path.join(path.dirname(__dirname), "dist", "dll");

config.mode("development");

config
  .entry("vendor")
  .add("jquery")
config.output
  .path(dllPath)
  .filename("[name]-[hash].dll.js")
  .library("_dll_[name]");

config
  .plugin("clean-webpack-plugin")
  .use(CleanWebpackPlugin)
  .end()
  .plugin("dll-plugin")
  .use(webpack.DllPlugin, [
    {
      name: "_dll_[name]",
      path: path.join(dllPath, "[name].dll.manifest.json")
    }
  ]);

module.exports = config.toConfig();
