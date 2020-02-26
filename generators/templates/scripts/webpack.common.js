const path = require("path");
const fs = require("fs");
const url = require("url");
const glob = require("glob");
const Config = require("webpack-chain");
const commandLineArgs = require("command-line-args");
const getPort = require("get-port");
const { mode } = commandLineArgs([
  { name: "mode", alias: "m", type: String },
  { name: "config", alias: "c", type: String }
]);
const srcPath = path.join(path.dirname(__dirname), "src");
const { resolveFilePath } = require("./util/resolveFileLoaderPath");
const userConfig = require("../config");
let isDev = mode === "development" ? true : false;

module.exports = async () => {
  const config = new Config();
  config.devtool(isDev ? "source-map" : false);
  config.mode(isDev ? "development" : "production");

  let port = await getPort({
    port: userConfig.devServer.port,
    host: "0.0.0.0"
  });

  //
  // multi entries config
  glob.sync(`${srcPath}/*.ts`).map(entry => {
    let baseName = path.basename(entry).split(".")[0];
    //  exclude .d.ts
    if (entry.match(/\.d\.ts/)) {
      return;
    }
    config
      .entry(baseName)
      .add(entry)
  });
  glob.sync(`${srcPath}/views/*.ejs`).map(view => {
    let baseName = path.basename(view).split(".")[0];
    config
      .plugin(`html-webpack-plugin-${baseName}`)
      .use(require("html-webpack-plugin"), [
        {
          minify: {
            useShortDoctype: true,
            minifyCSS: true
          },
          chunks: [baseName, "vendors"],
          filename: `${baseName}.html`,
          template: view,
          esModule: false
        }
      ]);
  });

  //  module config
  config.module
    .rule("typescript")
    .test([/\.ts$/, /\.js$/])
    .exclude.add(/node_modules/)
    .add(/\.d\.ts$/)
    .end()
    .include.add(srcPath)
    .end()
    .use("ts-loader")
    .loader("ts-loader")
    .options({
      configFile: __dirname + "/tsconfig.json"
    });

  config.module
    .rule("ignore-d.ts")
    .test(/\.d\.ts$/)
    .exclude.add(/node_modules/)
    .end()
    .use("ignore-loader")
    .loader("ignore-loader");

  config.module
    .rule("ejs")
    .test(/\.ejs$/)
    .exclude.add(/node_modules/)
    .end()
    .include.add(srcPath)
    .end()
    .use("html-loader")
    .loader("html-loader")
    .options({
      url(path) {
        return /^#/.test(path);
      }
    })
    .end()
    .use("ejs-html-loader")
    .loader("ejs-html-loader");

  config.module
    .rule("scss")
    .test(/\.(scss|css)$/)
    .exclude.add(/node_modules/)
    .end()
    .include.add(srcPath)
    .end()
    .when(
      isDev,
      config => {
        config.use("style-loader").loader("style-loader");
      },
      config => {
        config
          .use("mini-css-extract-plugin")
          .loader(require("mini-css-extract-plugin").loader);
      }
    )
    .use("css-loader")
    .loader("css-loader")
    .options({
      sourceMap: isDev
    })
    .end()
    .when(!isDev, config => {
      config
        .use("postcss-loader")
        .loader("postcss-loader")
        .options({
          ident: "postcss",
          sourceMap: true,
          plugins: loader => [require("autoprefixer")]
        });
    })
    .use("sass-loader")
    .loader("sass-loader")
    .options({
      prependData: `@import "@src/scss/variables.scss";`,
      sourceMap: true
    });

  config.module
    .rule("images")
    .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
    .exclude.add(/node_modules/)
    .end()
    .include.add(srcPath)
    .end()
    .use("url-loader")
    .loader("url-loader")
    .options({
      // limit: isDev ? false : 20 * 1024,
      limit: false,
      esModule: false,
      fallback: {
        loader: "file-loader",
        options: {
          esModule: false,
          name: path => resolveFilePath(path, isDev),
          outputPath: isDev ? undefined : "images"
        }
      }
    });

  config.module
    .rule("svg")
    .test(/\.(svg)(\?.*)?$/)
    .exclude.add(/node_modules/)
    .end()
    .include.add(srcPath)
    .end()
    .use("url-loader")
    .loader("url-loader")
    .options({
      limit: false,
      name: path => resolveFilePath(path, isDev),
      outputPath: isDev ? undefined : "images",
      esModule: false
    });

  config.module
    .rule("medias")
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .exclude.add(/node_modules/)
    .end()
    .include.add(srcPath)
    .end()
    .use("url-loader")
    .loader("url-loader")
    .options({
      limit: false,
      esModule: false,
      name: path => resolveFilePath(path, isDev),
      outputPath: isDev ? undefined : "medias"
    });

  config.module
    .rule("fonts")
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .exclude.add(/node_modules/)
    .end()
    .include.add(srcPath)
    .end()
    .use("url-loader")
    .loader("url-loader")
    .options({
      limit: false,
      esModule: false,
      name: path => resolveFilePath(path, isDev),
      outputPath: isDev ? undefined : "fonts"
    });

  config.module.noParse(/jquery/);

  // resolve
  config.resolve.modules
    .add(path.join(__dirname, "..", "node_modules"))
    .add(srcPath);
  config.resolve.extensions.add(".ts").add(".js");
  config.resolve.alias
    .set("$", "jquery")
    .set("jQuery", "jquery")
    .set("@src", path.resolve(path.dirname(__dirname), "src"));

  // friendly error plugin displays very confusing errors when webpack
  // fails to resolve a loader, so we provide custom handlers to improve it
  const { transformer, formatter } = require("./util/resolveLoaderError");
  config
    .plugin("case-sensitive-paths-webpack-plugin")
    .use(require("case-sensitive-paths-webpack-plugin"))
    .end()

    .plugin("friendly-errors")
    .use(require("friendly-errors-webpack-plugin"), [
      {
        additionalTransformers: [transformer],
        additionalFormatters: [formatter]
      }
    ])
    .end()
    .when(!isDev, config => {
      //  extract css
      config
        .plugin("mini-css-extract-plugin")
        .use(require("mini-css-extract-plugin"), [
          {
            filename: "css/[name].min.css",
            chunkFilename: "css/[name].chunks.min.css"
          }
        ]);
    })

    .plugin("process")
    .use(require("webpack").ProgressPlugin)
    .before("html-webpack-plugin-index")
    .end()

    .when(!isDev, config => {
      config
        .plugin("clean-webpack-plugin")
        .use(require("clean-webpack-plugin").CleanWebpackPlugin, [
          {
            verbose: true
          }
        ])
        .after("process");
    });

  //  output config
  config.output
    .publicPath(isDev ? "/" : userConfig.publicPath)
    .path(path.resolve(path.dirname(srcPath), "dist"))
    .filename("[name].min.js")
    .chunkFilename("[name].bundle.js");

  return { config, port, isDev };
};
