# Jquery
## `$(function){}`与`window.onload = function(){}`的区别  
1. `$(function){}`在DOM完全就绪时就可以被调用,而无需等待其关联元素完全下载完毕.
2. 如果想相关函数需要元素完全下载完毕,可以使用`load()`.
3  `$(function){}`可以多次调用,按顺序触发.

## 选择器  
`$('#id')`十分类似于CSS的选择器,这里只记录一些容易混淆和忘记的点.  
1. `$(div span)`与`$(div>span)`后者的`span`必须为`div`的子元素
2. `$(#prev).nextAll("div")`选取`#prev`后面的同辈`div`元素;  
	`$(#prev).siblings("div")`选取所有的同辈`div`元素无论前后.
3. 过滤选择器`:even``:odd`索引(从0开始)是偶\奇数的元素.  
	`:contains(text)` 包含文本`:parent`拥有子元素的  
	`:hidden` `visible`可见  
	`nth-child(index/even/odd/equation)`选取父元素先第index(从1开始)个子元素  
	`:enable` `:disable` `:checked` `:selected`表单属性相关
4. 属性选择器`[attribute=value]`属性值为value
5. **注意空格**  
	`$(.test :hidden)`class为test的里面的隐藏元素  
	`$(.test:hidden)` class为test而且自身隐藏的元素
	
## DOM操作
1. 用`attr()`方法来获取(和修改)属性的值  
		$("p").attr("title","newtitile")//修改一个属性
		$("p").attr({"title":"newtitle","name":"yourname",...}//修改多个属性
		removeAttr("title")//删除title属性
2. 创建元素时使用闭合的标签  
		var $li_1 = $("<li></li>");		
3. 插入节点  
	- 元素内部追加内容`append` `prepend`
	- 元素外插入内容  `after` `before` 
4. 删除节点  
`.remove()`完全删除;`.detach()`不会删除jQuery对象;`.empty()`只清空内容
5. 复制/替换节点  
	- `.clone()`参数为true时会同时复制绑定的事件
	- `replaceWith()`和`replaceAll()`
6. 包裹节点  
	- `.warp()`将所有匹配元素进行单独包裹
	- `.wrapall()`将所有匹配用一个元素包裹
	- `wrapInner()`间括号里元素的子元素用.前面的标签包裹
7. `html()`,`text()`,`val()`
8. 遍历节点  
	- `children()`匹配元素的所有子元素
	- `prev` `next()`匹配元素前\后面紧邻的同辈元素
	- `siblings()`匹配元素所有的同辈元素
	- `closest()`取得最近的匹配元素
9.CSS  
	- `.CSS`("属性","值")
	- `offset`取得当前视窗的相对偏移(.top,.left)
	- `position`获取元素相对于最近的相对定位的父级的位置
	- `scrollTop()` `scrollLeft`获取元素的滚动条距离顶端的距离