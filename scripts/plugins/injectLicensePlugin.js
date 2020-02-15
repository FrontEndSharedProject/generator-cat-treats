//  inject license plugin
class injectLicensePlugin {
  constructor(licenseHeader, regex) {
    this.licenseHeader = licenseHeader;
    this.regex = regex;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "injectLicensePlugin",
      (compilation, callback) => {
        Object.keys(compilation.assets).map(key => {
          //  filter for html file
          if (key.match(this.regex)) {
            let source = compilation.assets[key].source();

            compilation.assets[key].source = () =>
              `${this.licenseHeader}\n${source}`;
          }
        });
        callback();
      }
    );
  }
}

module.exports = injectLicensePlugin;
