/**
 * webpack工作流程
 */
const fs = require("fs");
const { SyncHook } = require("tapable");
const path = require('path')
class Compiler {
  constructor (options) {
    this.options = options
    this.hooks = {
      run: new SyncHook()
    }
  }
  run () {
    // 触发run钩子函数
    this.hooks.run.call()
    // 找到入口文件
    let entry = path.join(this.options.context, this.options.entry)
    // 从入口文件出发，调用所有配置的loader对模块进行编译，再找出该模块依赖的模块，在递归此步骤，直到所有入口文件的依赖文件都经过loader处理
    // 1.读取模块
    let entryContent = fs.readFileSync(entry, 'utf8')
    // 2.调用loader编译
    let entrySource = babelLoader(entryContent)
    console.log(entry, entryContent)
    // 
    let entryModule = {
      id: entry,
      source: entrySource
    }
  }
}


//1.获取webpack.config.js参数，和shell脚本上的参数

// 拿到配置参数
let options = require('./webpack.config.js')
// 拿到shell参数  shell配置参数  --key1 value1 --key2 value2
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));
console.log(args)
options = {...options, ...args}
console.log(options)
// 2.开始编译，将获取的参数初始化Compiler对象
let compiler = new Compiler(options)

// 3.加载所有配置的插件，
if (options.plugins && Array.isArray(options.plugins)) {
  options.plugins.forEach(plugin => {
    plugin.apply(compiler)
  })
}
// 4.执行对象的run方法开始编译
compiler.run()

// babel-loader 将高阶语法转化为低阶语法
function babelLoader (source) {
  return `function sum (a, b) {
    return a + b
  }`
}