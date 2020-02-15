//  replace .jpg|.png to .web ext
let lazyLoadAttrs = [
  "data-lazy",
  "data-original",
  "data-src",
  "lazyload",
  "lazy"
];
class WebpReplacePlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "WebpReplacePlugin",
      (compilation, callback) => {
        Object.keys(compilation.assets).map(key => {
          //  filter for html file
          if (key.match(/\.html$/)) {
            let source = compilation.assets[key].source();

            compilation.assets[key].source = () => this.replaceWebp(source);
          }
        });
        callback();
      }
    );
  }

  replaceWebp(html) {
    return html.replace(/<img([\w\W]+?)(\/)?>/g, (match, capture) => {
      let { attrs, allow, lazyload } = this.getImageOptions(capture);

      if (!allow) {
        return match;
      }

      let attrsString = "";
      Object.keys(attrs).map(
        key => (attrsString += key === "webp" ? "" : `${key}="${attrs[key]}" `)
      );

      return `<picture><source srcset="${(lazyload
        ? attrs[lazyload]
        : attrs["src"]
      ).replace(
        /\.(jpg|jpeg|png)/,
        ".webp"
      )}" type="image/webp"><source srcset="${
        lazyload ? attrs[lazyload] : attrs["src"]
      }" type="image/jpeg"><img ${attrsString} /></picture>`;
    });
  }

  getImageOptions(capture) {
    let attrsFilter = capture.split(" ").filter(attr => attr.length > 0);
    let attrs = {};
    let lazyload = false;
    attrsFilter.map(attr => {
      let splits = attr.split("=");
      if (splits.length > 1) {
        attrs[splits[0]] = splits[1].replace(/"|'/g, "");
      } else {
        attrs[splits[0]] = "";
      }

      if (~lazyLoadAttrs.indexOf(splits[0])) {
        lazyload = splits[0];
      }
    });

    let allow = attrs["src"] && attrs["src"].match(".(jpg|png|jpeg)??");
    if (attrs["webp"] && (attrs["webp"] === "false" || attrs["webp"] === "0")) {
      allow = false;
    }

    return { attrs, allow, lazyload };
  }
}

module.exports = WebpReplacePlugin;
