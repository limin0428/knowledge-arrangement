## webpack
#### webpack
> 

#### webpack第三方库引入方式
- 直接引入 
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
- CDN引入 externals
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
#### 环境变量
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

#### 