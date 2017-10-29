# Dom(文档对象模型)
Dom描绘了一个层次化的节点树,允许进行修改,添加和删除.

## nodeType
每个节点都有nodeType属性,表明节点类型.

		nodeType === 1 元素节点 -- 使用nodeName查看其值（标签名），和tagName一样返回大写字母
		nodeType === 3 文本节点 -- 使用nodeValue查看其值

## NodeList对象
类数组对象,和arguments一样并不是一个Array实例,用于保存一组有序的节点,实际上是基于Dom结构动态执行查询的结果.其保存在 **childNodes**中，可以通过方括号[]访问，也可以通过item(i)访问。
将NodeList对象转换为数组:  

		var arrayOfNodes = Array.prototype.slice.call(someNode.childNodes,0);
		
## 一些常用的命令  

- parentNode
- ChildNodes
- previousSibling (previousElementChild) 同一列表中的前一节点
- nextSibling (nextElementChild)同一列表中的下一节点
- firstChild(firstElementChild)
- lastChild (lastElementChild)
- hasChildNodes()有子节点则返回true
- createElement(label) 创建一个节点
- someNode.appendChild() 用于向childNodes末尾添加一个节点,若节点已存在相当于将其移到末尾(可用于排序)
- someNode.insertBefore(newNode,someNode.childNode[i]) 插在某个特定位置之前,返回该节点
- someNode.replaceChild(newNode,someNode.childNode[i]) 替换节点
- someNode.removeChild(newNode,someNode.childNode[i]) 移除节点
- 以上四个方法都是针对子节点而言,所以首先要获得parentNode,且子节点要存在
- cloneNode(true/false) true为复制节点及其子节点数;false只复制孤立的节点
- normalize 合并相邻的文本节点,删除空文本节点
- getElementById()
- getElementByTagName() 返回的是个NodeList
- getElementByClassName() 返回的是个NodeList
- getAttribute(name) 获取元素属性，不区分大小写，自定义属性加上data-前缀
- setAttribute(name,value) 设置元素属性，用.运算符更直接
- removeAttribute(name) 删除元素属性
- attributes属性，用来遍历元素属性会有用
- oDiv.style["style"] = value 非Dom方式设置元素属性  
- body=document.body
- document.getElementsByTagName("*") 返回页面中的所有元素

#### 与访问网页请求相关的属性
- document.URL 返回 http://www.baidu.com/  
- document.domain 返回域名 www.baidu.com ，可以手动设置值实现不同子域的通信
- document.referrer 返回你从那个页面点到这个页面的，比如搜索的页面，如果直接输入地址则返回空值

### Text类型
可以同归nodeValue或data属性访问Text节点中包含的文本，写入文本节点时，会进行转义，例如：< 会写为`&lt;`

浏览器在解析文档时永远不会创建相邻的文本节点。normalize()方法用在进行dom操作时合并文本节点，splitText()方法用来分隔文本节点，传入的参数为分隔的位置。

### 动态脚本
在页面加载时不存在，但将来某一时刻通过修改DOM动态添加的脚本。
方法一(添加外部文件）：
```
function loadScript(url){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}
loadScript("client.js");
```
方法二（添加行内js）：
```
function loadScriptString(code){
    var script = document.createElement("script");
    script.type = "text/javascript";
    try {
    script.appendChild(document.createTextNode(code));
    } catch (ex){
    script.text = code;
    }
    document.body.appendChild(script);
}
loadScriptString("function sayHi(){alert('hi');}");
```

### 动态样式
页面加载完成后动态加载到页面中的样式。
方法和动态脚本类似，不过需要添加到head中。

### 操作表格
- tBodies[i].rows[i].cells[i] 获取表格tr的简便操作
- 表格的标题保存在`<caption>`中

### 使用NodeList
如果想要迭代一个NodeList，最好对其length取值后进行遍历，否则容易造成死循环。
```
var divs = document.getElementsByTagName("div"),
    i,
    len,
    div;
for (i=0, len=divs.length; i < len; i++){
    div = document.createElement("div");
    document.body.appendChild(div);
}
```


## DOM扩展
1. querySelector()方法
接收一个CSS选择符，返回与该模式匹配的 **第一个**元素，如果没有则返回null。

2. querySelectorAll()方法
接收一个CSS选择符，返回一个NodeList实例。如果没有找到，返回一个空的NodeList，通过循环可以遍历NodeList实例。

3. matchesSelector()方法
调用的元素与传入的CSS选择符匹配，则返回true，否则，返回false。

3.classList属性
```
//删除"disabled"类
div.classList.remove("disabled");
//添加"current"类
div.classList.add("current");
//切换"user"类,有则删除没有则添加
div.classList.toggle("user");
//确定元素中是否包含既定的类名
if (div.classList.contains("bd") && !div.classList.contains("disabled")){
//执行操作
)
//迭代类名
for (var i=0, len=div.classList.length; i < len; i++){
doSomething(div.classList[i]);
}
```

### 焦点管理
元素获取焦点的方式有页面加载，用户输入（tab）和代码中调用focus()方法。

- document.activeElement属性，引用DOM中当前获得了焦点的元素
- hasFocus()方法，确定文档是否获得了焦点，知道用户是不是则会能够在于页面交互。

### HTMLDocument
1. readState属性 检验文档是否加载完成，会返回loading或complete
2. document.compateMode == CSS1Compat 为标准模式， ==BackCompat为混杂模式
3. var head = document.head || document.getElementsByTagName("head")[0];

### 插入标记
1. innerHTML  
在读模式下，返回与调用元素所有的子节点对应的HTML标记；写模式会创建DOM树去替换调用元素的所有子节点。
插入HTML字符串，返回的字符串是根据原始HTML字符串创建的DOM树经过序列化之后的结果。
创建和销毁他会有性能的消耗，所以应注意减少不必要的重复调用。
2. outerHTML 
在读模式下，返回调用它的元素及所有子节点的HTML标签；写模式下，DOM树会完全替换调用元素。
3. insertAdjacentHTML()
它接收两个参数：插入位置和要插入的 HTML 文本。

#### scrollIntoView()方法
让元素滚到可视区域，传入true或不传入任何参数会让元素上方与视窗上方平齐，传入false调用元素的尽可能底部出现在视窗内。作用对象是元素的容器。

#### children属性
只包含元素中同样还是元素的子节点。

#### contains()方法
去顶传入的节点是否为调用该方法的节点的子节点。

### 滚动
1. scrollIntoViewIfNeeded(alignCenter)：
只在当前元素在视口中不可见的情况下，才滚动浏览器窗口或容器元素，最终让它可见。如果当前元素在视口中可见，这个方法什么也不做。如果将可选的 alignCenter参数设置为 true ，则表示尽量将元素显示在视口中部（垂直方向）。作用对象是元素的容器。
2. scrollByLines(lineCount) ：  
将元素的内容滚动指定的行高， lineCount 值可以是正值，也可以是负值。
3. scrollByPages(pageCount)：
将元素的内容滚动指定的页面高度，具体高度由元素的高度决定。

### 访问元素的样式
对于使用短划线(backgroud-image)的CSS属性名必将其转换成驼峰大小写形式才能通过Javascript访问。float应转换成cssFloat。标准模式下设置长度必须给单位。

通过 `.style.cssText` 可以快捷得设置多项样式

通过getPropertyValue()获得相关css属性的值；或者通过getPropertyCSSValue()返回一个包含两个属性的CSSValue对象，分别表示cssText和cssValueType（0为继承，1为基本值，2为值列表，3为自定义值）

使用removeProperty()方法移出一个CSS属性。

### 元素大小
#### 偏移量
- offsetHeight：垂直方向张占用的空间，包括高度、可见的水平滚动条高度、上下边框高度。
- offsetWidth : 水平方向..
- offsetLeft：元素的左外边框至包含元素的左内边框之间的像素距离。
- offsetRight:元素的右..
- offsetParent 获取元素用来定位的父级

### 客户区大小  
元素内部空间的大小，滚动条占用的空间不计算在内。多用来确定浏览器视口大小。可以使用 document.documentElement 或 document.body （在 IE7 之前的版本中）的
clientWidth 和 clientHeight 。

### 滚动大小  
- scrollHeight 没有滚动条的情况下，元素内容的总高度。
- scrollWidth 没有滚动条的情况下，元素内容的总宽度。
- scrollLeft 被隐藏在内容区左侧的像素数。
- scrollTop  被隐藏在内容区域上方的像素数。
