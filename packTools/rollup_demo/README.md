## rollup
- Rollup是一个JavaScript模块打包器，可以将小块代码编译成大块复杂的代码
- 利用ES6模块设计，利用tree-shasking生成更简洁、更简单的代码
- 一般而言，对于应用使用webpack，对于类库使用rollup
- 代码库是基于ES6，且希望代码能够直接被其他人使用，使用Rollup
- [rollupjs](https://www.rollupjs.com/)

## 安装
```js
npm install rollup --global
npm i @rollup/plugin-node-resolve rollup-plugin-babel @babel/core @babel/preset-env -D
```

## 启动
- 命令行:
```
rollup src/main.js -o bundle.js -f cjs  
// -o 表示输出路径  -f 表示输出的bundle类型
```
- 配置文件
[rollup.config.js](./rollup.config.js)
