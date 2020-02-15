# generator-cat-treats

cat-treats is a generator for yeoman, that's designed from the ground up to be incrementally adoptable, it'll be even easier to save you coding time, cuz sometime, u dont wanna ur cat mess up with.

# scripts

This is what you will see in the package.json of a project using the default preset:

```json
{
  "scripts": {
    "serve": "npx webpack-dev-server --mode=development --config ./scripts/webpack.dev.js",
    "build": "npx webpack --mode=production --config ./scripts/webpack.prod.js",
    "build-server": "npx http-server ./dist",
    "dll": "npx webpack --config ./scripts/webpack.dll.config.js",
    "wep-convert": "node ./scripts/convertWebp.js"
  }
}
```

You can invoke these scripts using npm:

```shell script
$ npm run serve
$ npm run build
$ npm run build-server
$ npm run dll
$ npm run wep-convert
```

# License

[MIT](https://github.com/carl-jin/generator-cat-treats/blob/master/LICENSE)
