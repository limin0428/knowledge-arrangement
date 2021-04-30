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
    // 找到入口文件
    let entry = path.join(this.options.context ? this.options.context: __dirname, this.options.entry)
    // 从入口文件出发，调用所有配置的loader对模块进行编译，再找出该模块依赖的模块，在递归此步骤，直到所有入口文件的依赖文件都经过loader处理
    // 1.读取模块
    let entryContent = fs.readFileSync(entry, 'utf8')
    // 2.调用loader编译 
    let entrySource = babelLoader(entryContent)
    // console.log(entry, entryContent)
    // 3.模块收集
    // module集合 
    let modules = [] 
    let entryModule = {
      id: entry,
      source: entrySource
    }
    modules.push(entryModule)
    // 4.根据入口和模块之间的关系，组装成一个包含多个模块的chunk
    const entryPath = entry.split('/')
    let chunk = {
      name: entryPath[entryPath.length - 1], // 输入文件名称
      modules  // 单个chunk下的模块集合
    }
    // 5.chunks收集  多chunk例如路由懒加载 创建单独的chunk，在主文件中引入<script src='router_layer.js'></script>
    let chunks = []
    chunks.push(chunk)
    // 6.再把每个chunk生成单个的文件夹，加入到输出列表
    let file = {
      fileName: this.options.output.filename,
      source: chunks.find(chunk => chunk.name === entryPath[entryPath.length - 1]).modules.reduce((pre, next) => {
        return pre + next.source
      }, '')
    }
    // 7.输出文件内容
    const filePath = path.join(this.options.output.path,file.fileName)
    // 判断是否有输出文件夹
    const dirLists = fs.readdirSync(__dirname)
    if (!dirLists.find(item => path.resolve(__dirname, item) === this.options.output.path)) {
      // 没有出口文件夹，创建文件夹
      fs.mkdirSync(this.options.output.path)
    }
    fs.writeFileSync(filePath, file.source, 'utf-8')
    // 8.触发run钩子函数 利用webpack的广播机制，插件会监听到自己的事件后执行回调
    this.hooks.run.call()
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

// babel-loader 将高阶语法转化为低阶语法 假设babel-loader的实现
function babelLoader (source) {
  return `function sum (a, b) {
    return a + b
  }`
}
