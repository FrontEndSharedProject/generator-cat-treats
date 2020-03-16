const glob = require("glob");
const path = require("path");
const fs = require("fs");
const projectName = path.basename(path.dirname(__dirname));
const distPath = path.join(path.dirname(__dirname), "dist");
const userConfig = require("../config");

function main() {
  glob.sync(`${distPath}/**/*.{js,css}`).map(fileName => {
    if (/^index\.min/.test(path.basename(fileName))) {
      fs.renameSync(
        fileName,
        fileName.replace("index.min", `${projectName}.min`)
      );
    }
  });

  let html = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
  html = html.replace(/index\.min/g, `${projectName}.min`);
  fs.writeFileSync(path.join(distPath, "index.html"), html, "utf-8");
}

if (userConfig.useProjectNameOutput) {
  main();
}
