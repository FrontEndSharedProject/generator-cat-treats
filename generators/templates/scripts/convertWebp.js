const userConfig = require("../config");
const glob = require("glob");
const path = require("path");
const distPath = path.resolve(path.dirname(__dirname), "dist", "images");
const webp = require("webp-converter");

glob.sync(`${distPath}/**/*.{jpg,png,jpeg}`).map(path => {
  webp.cwebp(
    path,
    path.replace(/\.(jpg|png|jpeg)/, ".webp"),
    `-mt -v -q ${userConfig.webp.quality ? userConfig.webp.quality : 80}`,
    () => {
      console.log(`converted ${path.split("/dist/img/")[1]} successful!`);
    }
  );
  console.log(path);
});
