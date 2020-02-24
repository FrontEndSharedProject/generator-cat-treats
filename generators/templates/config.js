module.exports = {
  publicPath: "/",
  webp: {
    replacePlugin: true,
    quality: 80
  },
  devServer: {
    port: 8080,
    host: "localhost"
  },
  injectLicense: {
    includes: /\.(css|js)$/,
    licenseHeader: ``
  },
  /**
   * integrate config into webpack config
   * @param {object} config - webpack-chain object
   * @param {boolean} isDev - env of current command
   * @example
   * config.devtool('eval-cheap-module-source-map')
   *   config.module
   *   .rule("scss")
   *   .use("css-loader")
   *   .load("css-loader")
   *   .options({});
   *
   *   more used checkout https://github.com/neutrinojs/webpack-chain
   */
  chainWebpack(config, isDev) {}
};
