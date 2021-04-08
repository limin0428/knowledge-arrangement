## CSS面试题
####  伪类和伪元素
> 伪类：元素的特殊效果，例如:focus、active、hover

> 伪元素：DOM树没有定义的虚拟元素，例如:before、after

#### 盒模型

 对比 | 标准盒模型 | 怪异盒模型
:---: |:---:| :---:
box-sizing | content-box | border-box
内容计算 | 宽(高) = width(height) | 宽(高) = width(height) + padding + border

#### Css选择器
- 通配符：*
- 标签选择器：div
- 类选择器：.nav-bar
- ID选择器：#nav-bar
- 相邻选择器：h5+p
- 子选择器：.nav-bar>div
- 后代选择器：.nav-bar div
- 属性选择器：div[data-type="red"]

#### link和@import
> link：XHTML的标签，无兼容问题，在页面载入时，同时加载

> @import：属于css规则，低版本浏览器不支持，在页面完全载入后加载(一开始没有样式，闪烁后出现样式)

#### Css单位

##### 相对单位
单位 | 描述
:---:|:---:
em | 相当于当前元素的字体尺寸
ex | 依赖于英文字母小x的高度
ch | 数字0的宽度
rem | 根元素(html)的font-size
vw | 相对于视口宽度的百分比
vh | 相对于视口高度的百分比
vmin | vw和vh较小的
vmax | vw和vh较大的
% | 父级元素的百分比

##### 绝对单位
单位 | 描述
:---:|:---:
cm | 厘米
mm | 毫米
in | 英尺(1in = 96px = 2.54cm)
px | 像素

#### Css动画
> transition：property duration timing-function delay

属性 | 描述
:---:|:---:
property | 添加过渡效果的属性名称
duration | 过渡完成时间
timing-function | 速度曲线
delay | 过渡何时开始
```css
.move {
    transition: left 1s, background 0.7s
}
```
> animation：name duration time-function delay iteration-count direction play-state fill-mode

属性 | 描述
:---:|:---:
name | 调用@keyframes定义的动画名称
duration | 动画时间
timing-function | 速度曲线
delay | 延迟时间
iteration-count | 动画播放次数
direction | 动画播放方向
play-state | 播放状态
fill-mode | 动画结束后，元素的样式
```css
.move {
    animation: move 3s linear 0.5s
}
@keyframes move {
    0% {
        left: 0;
        background: red;
    }
    100% {
        left: 300px;
        background: blue
    }
}
```

#### 浏览器渲染

![webkit渲染流程](https://images2018.cnblogs.com/blog/1028513/201805/1028513-20180530154313816-1498972038.png)

渲染步骤：
- 浏览解析html，生成DOM tree(深度优先)
- 解析css，生成css rule tree
- DOM tree和cssOM构造render tree
- layout(已知各个节点的css定义和从属关系，计算每个节点出现在屏幕中的位置)
- 绘制
- 显示

##### 回流、重绘
> 回流：页面布局发生变化时，DOM重新构建，渲染树也会重新渲染(是否触发layout)

> 重绘：是否触发painting

##### 回流触发
- 页面首次渲染
- 元素删减
- 几何属性变化(尺寸)
- 元素位置变更
- 获取元素的偏移量属性(浏览器为了保证值的正确也会回流获取最新的值)
- resize事件

##### transform和marginTop
> transform是通过创建一个RenderLayers(渲染)合成层，拥有独立的GraphicsLayers(绘图层)，每一个GraphicsLayers都有一个Graphics content进行绘制，输出位图合并展示(只触发重绘)

##### 独立的合成层
- 有3D或者transform的css属性的层
- video、canvas元素的层
- flash

#### 布局方式
- 静态块级
- 弹性布局(flex)
- 响应式布局
- 浮动布局
- 定位布局

##### 清除浮动
- 设置父元素的高
- 浮动元素后添加空元素，clear：both
- 父元素后添加伪元素，clear：both
- 触发BFC

#### BFC

> BFC：块级格式上下文，是页面上一个隔离的独立容器，容器的子元素不会影响到外面的元素，反之亦然

##### BFC特性
- 

##### BFC触发条件
