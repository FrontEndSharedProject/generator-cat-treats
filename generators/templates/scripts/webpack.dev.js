const path = require("path");
const srcPath = path.join(path.dirname(__dirname), "src");
const userConfig = require("../config");

let devServer;

class ejsReloadPlugin {
  constructor() {}
  apply(compiler) {
    const cache = {};
    compiler.plugin("compilation", thing =>
      thing.plugin("html-webpack-plugin-after-emit", (data, callback) => {
        const orig = cache[data.outputName];
        const html = data.html.source();
        // plugin seems to emit on any unrelated change?
        if (orig && orig !== html)
          devServer.sockWrite(devServer.sockets, "content-changed");
        cache[data.outputName] = html;
        callback && callback();
      })
    );
  }
}

module.exports = async () => {
  let { config, port, isDev } = await require("./webpack.common")();
  //  dev server
  config.devServer
    // .quiet(true)
    .contentBase(path.resolve(path.dirname(srcPath), "dist"))
    .watchContentBase(true)
    .compress(false)
    .overlay({ warnings: false, errors: true })
    .https(false)
    .port(port)
    .inline(true)
    .writeToDisk(false)
    .useLocalIp(true)
    .open(true)
    .hot(true)
    .host("0.0.0.0")
    .disableHostCheck(true)
    .stats({
      timings: true,
      modules: false,
      assets: false,
      entrypoints: false,
      assetsSort: "field",
      builtAt: false,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkGroups: false,
      chunkModules: false,
      chunkOrigins: false,
      performance: true,
      errors: true,
      warnings: true
    })
    .before((app, server) => (devServer = server));

  config.plugin("ejs-reload-plugin").use(ejsReloadPlugin);

  userConfig.chainWebpack(config, isDev);

  return config.toConfig();
};
