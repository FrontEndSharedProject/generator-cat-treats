exports.resolveFilePath = (path, isDev) => {
  if (isDev) {
    return "[path][name].[ext]";
  }
  path = path.replace(/\\/g, "/");
  let splits = path.split("/src/assets/");
  if (splits.length > 1) {
    return splits[1];
  } else {
    return `[name].[ext]`;
  }
};
