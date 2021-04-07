## HTML面试题
#### 标签语义化
> 合适的结构用合适的标签

优点：
- 对搜索引擎友好，利于SEO
- 增强代码阅读性

如何语义化：
头部：header  导航：nav  文章：article  块：section  侧栏：aside  底部：footer

#### Html5新特性
- 拖拽(Drag and drop)API
- 语义化更多的标签
- 音频(audio)、视频(video)API
- 画布(Canvas)API
- 地理(Genlocation)API
- 本地存储localStorage
- 新的技术webworker、websocket、Geolocation

#### Html5兼容处理

```javascript
<script>
    document.createElement('header')
</script>
<header></header>
```
或者第三方库
[html5shiv](https://github.com/aFarkas/html5shiv/blob/master/src/html5shiv.js)

#### SEO
> 网站内容被搜索引擎识别，提高网站权重，增加网站友好度

#### SEO规范
- title、description、keyword权重递减
```html
<title>标题</title>
<meta name="description" content="这是一段简述"></meta>
<meta name="keyword" content="SEO、优化"></meta>
```
- 语义化的HTML标签
- 非装饰性图片必须加alt
- 重要的内容放在HTML前面，优先加载
- 每个页面只有一个h1标签
- 页面扁平化，层级不要过深
- 采用友情链接，在别人的网站导入自己网站的链接
- 外部链接增加el = "nofollow"，防止爬出网站
```html
<a href="www.buzhidao.com" rel="nofollow"/>
```
- ajax无法抓取，重要内容直接输出
- js、flash、图片、视频、iframe抓取不到
- 提高网站速度，超时，爬虫会退出
- 友好的404页面

#### script的defer和async
> defer 立即下载，但延迟执行(页面解析完毕后执行)

> async 下载，异步执行

##### 相同点
- 加载文件都不会阻塞页面渲染
- script标签内有内容则都不生效
- 脚本中都不能是用document.write方法

##### 不同点
- defer会按照顺序执行