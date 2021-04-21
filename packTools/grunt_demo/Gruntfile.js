module.exports = function (grunt) {
  // 加载babel任务
  grunt.loadNpmTasks('grunt-babel')
  // 初始化配置文件
  grunt.initConfig({
    // babel任务配置
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      // 输出配置
      dist: {
        files: {
          'dist/main.js': 'src/main.js'
        }
      }
    }
  })
  // default指得是入口任务(固定)
  grunt.registerTask('default', ['babel'])
}