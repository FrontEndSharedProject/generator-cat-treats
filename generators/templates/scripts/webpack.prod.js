const userConfig = require("../config");
const WebpReplacePlugin = require("./plugins/WebpReplacePlugin");
const injectLicensePlugin = require("./plugins/injectLicensePlugin");
const injectLatestTag = require("./plugins/injectLatestTag");

module.exports = async () => {
  let { config, port } = await require("./webpack.common")();
  //  build js path config
  config.output
    .filename("js/[name].min.js")
    .chunkFilename("js/[name].chunk.js");

  config.optimization.splitChunks({
    chunks: "all",
    cacheGroups: {
      automaticNameDelimiter: "-",
      default: false,
      vendors: {
        name: `vendors`,
        test: /[\\/]node_modules.*\.js|[\\/]vendor.*\.js/,
        priority: -10,
        chunks: "initial"
      }
    }
  });

  userConfig.webp.replacePlugin &&
    config.plugin("webp-replace-plugin").use(WebpReplacePlugin);
  userConfig.injectLicense.licenseHeader.length > 0 &&
    config
      .plugin("inject-license-plugin")
      .use(injectLicensePlugin, [
        userConfig.injectLicense.licenseHeader,
        userConfig.injectLicense.includes
      ]);

  config.plugin("inject-latest-tag-plug").use(injectLatestTag);
  userConfig.chainWebpack(config);

  config.stats({
    timings: true,
    modules: false,
    assets: true,
    entrypoints: true,
    assetsSort: "size",
    builtAt: true,
    cached: true,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkGroups: false,
    chunkModules: false,
    chunkOrigins: false,
    performance: true,
    errors: true,
    warnings: true,
    colors: true,
    hash: false,
    reasons: true,
    publicPath: true
  });

  return config.toConfig();
};
