let babelCore = require('@babel/core')
/**
 * @param {*} source 
 * @returns 
 */
function loader (source) {
  let es5 = babelCore.transform(source, {
    presets: ['@babel/preset-env']
  })
  return es5
}
module.exports = loader 
/**
 * 1.@babel/core 将ES6代码转成ES6语法树
 * 2.@babel/preset-env 将ES6语法树转化为ES5语法树
 * 3.@babel/core 将ES5语法转成ES5代码
 */