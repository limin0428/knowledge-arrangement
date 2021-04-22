# webpack 

## webpack与其他打包工具对比

### [grunt](https://www.gruntjs.net/)
- 一句话：自动化。对于需要反复重复的任务，例如压缩（minification）、编译、单元测试、linting等，自动化工具可以减轻你的劳动，简化你的工作。当你在 Gruntfile 文件正确配置好了任务，任务运行器就会自动帮你或你的小组完成大部分无聊的工作。
- 最老牌的打包工具，他运用配置的思想来写打包脚本，一切皆配置

**优点** 
- 出现的比较早

**缺点**
- 配置项繁多(核心思想:运用配置)
- 不同的插件可能会有自己的拓展字段(相比较webpack配置的plugins)
- 学习成本比较高，需要明白各插件的配置规则和配合方式

**[实例](../packTools/grunt_demo)**

### [gulp](https://www.gulpjs.com.cn/)
- 用自动化构建工具增强你的工作流程。gulp 将开发流程中让人痛苦或耗时的任务自动化，从而减少你所浪费的时间、创造更大价值。
- 基于nodejs的steam流打包
- 定位是基于任务流的自动化构建工具
- Gulp是通过task对整个开发过程进行构建

**优点** 
- 流式写法简单直观
- API简单，代码量少
- 易于学习和使用
- 适合多页面应用开发

**缺点**
- 异常处理比较麻烦
- 工作流程顺序难以精细控制
- 不太适合单页或者自定义模块的开发

**[实例](../packTools/gulp_demo)**

### [webpack](https://webpack.docschina.org/concepts/)
- webpack 是一个用于现代JavaScript应用程序的静态模块打包工具。当webpack处理应用程序时，它会在内部构建一个依赖图(dependency graph)，此依赖图对应映射到项目所需的每个模块，并生成一个或多个bundle
- 通过loader将任何形式的资源都可以视为模块。

**优点** 
- 可以模块化的打包任何资源
- 适配任何模块系统
- 适合SPA单页面应用开发

**缺点**
- 学习成本高，配置复杂
- 通过babel编译后的js代码打包后体积过大

**[实例](../packTools/webpack_demo)**

### [rollup](https://www.rollupjs.com/)
- Rollup是一个JavaScript模块打包器，可以将小块代码编译成大块复杂的代码
- 利用ES6模块设计，利用tree-shasking生成更简洁、更简单的代码
- 一般而言，对于应用使用webpack，对于类库使用rollup
- 代码库是基于ES6，且希望代码能够直接被其他人使用，使用Rollup

**优点** 
- 用标准化的格式(ES6)来写代码，通过减少代码尽可能地缩小体积

**缺点**
- 对代码拆分、静态资源、CommonJS模块支持不好

**[实例](../packTools/rollup_demo)**

### [parcel](https://parceljs.org/)
- 极速零配置Web应用打包工具

**优点** 
- parcel内置了常见场景的构建方案及其依赖，无需再安装各种依赖
- parcel能以HTML为入口，自动监测和打包资源
- parcel默认支持模块热替换

**缺点**
- 不支持sourceMap
- 不支持剔除无效代码(tree-shaking)
- 配置不灵活

**[实例](../packTools/parcel_demo)**

## loader和plugin
- Loader:加载器，webpack将一切文件视为模块，但是原生webpack只能解析js文件，loader(将非js文件转化成js)的作用就是让webpack拥有了加载和解析非js文件的能力
- plugin:插件，plugin可以扩展webpack的能力，让webpack具有更多的灵活性，在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack的API改变输出结果

## webpack工作流程
![webpack工作流程图](/assets/images/webpack工作流程.jpg)
- 

[实例](+)
## webpack第三方库引入方式
- 直接引入  npm安装
- 插件引入  webpack.providePlugin/ [webpack-provide-global-plugin](https://www.npmjs.com/package/webpack-provide-global-plugin)
```
 new webpack.providePlugin({
   "_": "loadsh"
 })
```
- loader解析 [expose-loader](https://www.npmjs.com/package/expose-loader)
```
{
  test: require.resolve("loadsh"),
  loader: "expose-loader",
  options: {
    exposes: {
      globalName: "_",
      override: true,
    }
  },
}
```
- CDN引入 + externals
```
externals: {
  "_": "loadsh"
}
```
- CDN + [html-webpack-externals-plugin](https://www.npmjs.com/package/html-webpack-externals-plugin)
```
new HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'loadsh',
      entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.core.js',
      global: '_',
    },
  ],
})
```
## 环境变量
- --env=[环境名称]
```
build: webpack --env=production
```
- [cross-env](https://www.npmjs.com/package/cross-env)
```
build: cross-env NODE_ENV=production webpack 
```
- [webpack.DefinePlugin](https://webpack.docschina.org/plugins/define-plugin/) 定义浏览器全局变量
```
new webpack.DefinePlugin({
  NODE_ENV: "production"
})
```

## 