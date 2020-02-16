// 创建 yeoman generator 的核心功能模块.
const Generator = require("yeoman-generator");

// 路径模块
const path = require("path");

/**
 * Base generator.
 */
module.exports = class extends Generator {
  /** 构造函数 */
  constructor(args, opts) {
    // 继承必须.
    super(args, opts);

    // 获取 AppName，使用路径尾.
    this.appName = path.basename(process.cwd());
    // 设置 Author.
    this.appAuthor = "";
  }

  /**
   * 初始化方法.
   */
  initializing() {
    this.log("building...");
  }

  /**
   * 用户交互组件
   */
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "projectName",
        message: `what'd like you call this project?`,
        default: this.appname // Default to current folder name
      }
    ]).then(answers => {
      let projectName = answers.projectName
        ? answers.projectName
        : this.appname;
      projectName = projectName.trim().replace(" ", "-");
      projectName = projectName.replace(/^-/, "");
      this.appName = projectName;
    });
  }

  /**
   * 写入配置
   */
  configuring() {
    // 获取 package 配置模板.
    let defaultSettings = this.fs.readJSON(this.templatePath("package.json"));
    // 做新 package 配置文件.
    let packageSettings = {
      name: this.appName,
      version: "0.0.1",
      description: `${this.appName} - Generated by generator-cat-treats`,
      main: "index.js",
      scripts: defaultSettings.scripts,
      author: this.appAuthor,
      license: "MIT",
      devDependencies: defaultSettings.devDependencies,
      dependencies: defaultSettings.dependencies,
      browserslist: defaultSettings.browserslist
    };

    // 写入 package.json.
    this.fs.writeJSON(this.destinationPath("package.json"), packageSettings);
  }

  /**
   * 写入文件
   */
  writing() {
    //  放置app目录
    this.fs.copy(this.templatePath("scripts"), this.destinationPath("scripts"));
    this.fs.copy(this.templatePath("src"), this.destinationPath("src"));

    // 拷贝入口页.
    /* 拷贝所需的文件. */
    this.fs.copy(
      this.templatePath("config.js"),
      this.destinationPath("config.js")
    );
  }

  /**
   * 安装方法
   */
  install() {
    // 安装 package 安装.
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    }).then(() => {
      this.spawnCommand("npm", ["run", "serve"]);
    });
  }
};
