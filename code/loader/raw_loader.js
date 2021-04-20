/**
 * loader 本质是一个函数
 * 接收源文件，返回一个js模块代码
*/
function loader(source) {
  return `module.exports = "${source}"`
}
module.exports = loader