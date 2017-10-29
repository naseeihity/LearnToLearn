浮动的产生是为了实现 **文字环绕效果**，现在我们使用浮动实现很多布局。浮动的元素宽度会收缩为内容区域宽度，而不是再占据一整行。
## 为什么要清浮动
因为浮动元素会 **脱离文档流**,无法撑开父元素造成父元素的塌陷。  

- 浮动的其他影响
    1. 对于浮动元素自身，会变成块级对象,即`display:block`.
    2. 对于非浮动的块级兄弟元素，会占据浮动元素原始文档流中的位置，并且位于浮动元素z轴方向的下方，而且无法通过`z-index`调整到浮动元素上方。但是，其内部的文字会环绕浮动元素；对于内联的兄弟元素，会直接形成文字环绕效果。
    3. 对于浮动的兄弟元素，如果方向相同会更在上一个浮动元素的后方，只要那一行放的下。
    4. 对于其子元素。浮动元素的子元素会撑开浮动元素，使其高度适应于子元素的高度。

## 如何清除浮动
在包含浮动元素的父元素上插入`.clearfix`类。
### 方法一：底部插入`clear:both`
~~~
.clearfix:after{
    content:'';
    display:table;
    clear:both;
}
~~~

~~~
.container:before,
.container:after {
    content:"";
    display:table;
}
.container:after {
    clear:both;
}
.container {
    zoom:1; /* For IE 6/7 (trigger hasLayout) */
}
~~~
### 方法二：使父元素成为新的BFC
~~~
*zoom:1(IE6/7);
float:left/right;
position:absolute/fixed;
overflow:hidden/scroll(IE7+);
display:inline-block/table-cell;
~~~

## 为什么这些方法可以清除浮动 (的影响)
### 一、clear属性
规定了元素哪一侧 **不允许出现浮动元素**，一旦清除某一侧的浮动，会使元素的上外边框边界刚好在该侧浮动元素的下外边距边界之下。

### 二、新的BFC (IE中的haslayout)
>BFC(Block formatting context)直译为"块级格式化上下文"。

#### BFC的布局规则
- 内部的Box会在垂直方向，一个接一个地放置。
- Box垂直方向的距离由margin决定。属于同一个BFC的两个毗邻的Box的margin会发生重叠.
这里 **毗邻的定义**为：同级或者嵌套的盒元素，并且它们之间没有非空内容、Padding或Border分隔。
- 每个元素的margin box的左边,与包含块border box的左边相接触(对于从左往右的格式化，否则相反).即使存在浮动也是如此.
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素或受外面的元素影响.
- 计算BFC的高度时，浮动元素也参与计算.
- BFC区域不会与floatbox重叠.

从BFC的布局规则中我们就可以看出为什么他实现了清楚浮动带来的父元素的塌陷的问题,具体产生新的BFC的方法:
- 根元素html
- 浮动元素，float 除 none 以外的值
- 绝对定位元素，position（absolute，fixed）
- display 为以下其中之一的值 inline-blocks，table-cells，table-captions
- overflow 除了 visible(默认值) 以外的值（hidden，auto，scroll）

## BFC规则的其他用途
1. 解决外边距重叠问题
一个常见的外边距的场景就是我希望一个div的子元素div能跟他的父元素上边距有一定的margin,如果直接对该子元素设置margin并不能达到预想的效果,而会将两者整体向下移动一定的距离,也就是和更高一级的父元素产生了margin.  
之所以会出现这样的情况是因为margin重叠的规则, **属于同一个BFC的两个毗邻的Box的margin会发生重叠.**而通过增加border或者padding来分隔两个box显然不够理想.于是我们选择通过产生新的BFC来实现去除两个box见的毗邻状态,常见的方法是使用`overflow:hidden`.

2. 去除图片的文字环绕效果
对于浮动元素的非浮动块级兄弟元素,其文字依然会环绕浮动元素,这有时候并不是我们想要的效果,通过BFC规则的`BFC区域不会与floatbox重叠.`我们就可以给该兄弟元素设置`overflow:hidden`来实现去除文字环绕效果的功能.