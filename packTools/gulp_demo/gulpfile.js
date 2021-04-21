const { src, dest } = require('gulp');
// src 读取文件并生成一个Node流 
// dest 写如文件
const babel = require('gulp-babel');
function defaultTask(cb) {
  src('src/main.js')
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(dest('dist'))
  // place code for your default task here
  cb();
}

exports.default = defaultTask