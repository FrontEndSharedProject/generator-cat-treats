//  inject latest tag plugin
const exec = require("child_process").exec;

let getLatestTag = () => {
  return new Promise(
    (res, rej) =>
      exec("git tag", (err, stdout) =>
        err
          ? rej()
          : res(
              stdout
                .trim()
                .split("\n")
                .pop()
            )
      ).stdout
  );
};

class injectLatestTag {
  constructor() {}

  async apply(compiler) {
    let latestTag = await getLatestTag();
    latestTag = latestTag.length > 5 ? `/* tag : ${latestTag} */\n` : "";
    compiler.hooks.emit.tapAsync("injectLatestTag", (compilation, callback) => {
      Object.keys(compilation.assets).map(key => {
        //  filter for html file
        if (key.match(/\.(css|js)$/)) {
          let source = compilation.assets[key].source();
          compilation.assets[key].source = () => `${latestTag}${source}`;
        }
      });
      callback();
    });
  }
}

module.exports = injectLatestTag;
