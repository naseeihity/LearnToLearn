# Event
1. 获取event对象

		document.onclick = function(ev){
			var oEvent = ev || event;//ev是为了兼容IE
			}

    事件对象：包括导致事件的元素、事件的类型以及其他与特定事件相关的信息。

    事件对象的相关属性和方法：
    - bubbles    表明事件是否冒泡
    - cancelable 表明是否可以取消事件的默认行为
    - currentTarget 事件处理程序当前正在处理时间的那个元素
    - eventPase 1表示捕获阶段，2表示处于目标，3表示冒泡阶段
    - preventDefault() 取消事件的默认行为，也可以用return false实现。
    - target 事件的目标
    - type 被触发的事件的类型
    - stopPropagation()立即停止事件在DOM层次中的传播，取消进一步的事件捕获或冒泡，等效于cancelBubble方法。
    
    事件处理程序内部，对象this始终等于currentTarget的值。

2. 事件冒泡  
事件从最具体的元素接收，然后逐级向上传播到较为不具体的节点。
较常用的是取消冒泡  
		event.cancelBubble = true;
		
## DOM事件流
事件捕获阶段、处于目标阶段和事件冒泡阶段。

## DOM2级事件处理程序
```
var btn = document.getElementById("myBtn");
    btn.addEventListener("click", function(){
        alert(this.id);
}, false);
```
最后这个布尔值参数如果是 true ，表示在捕获阶段调用事件处理程序；如果是 false ，表示在冒泡阶段调用事件处理程序。**大多数情况将事件处理程序添加到事件冒泡阶段，只有需要在事件到达目标之前捕获他时才将其添加到捕获阶段。**
>通过 addEventListener() 添加的事件处理程序只能使用 removeEventListener() 来移除；移除时传入的参数与添加处理程序时使用的参数相同。这也意味着通过 addEventListener() 添加的匿名函数将无法移除.

3. 获取x,y坐标  

		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		x = event.clientX + 'px';
		y = event.clientY + scrollTop + 'px';
		
4. 鼠标  

	- onClick
	- onDblClick
	- onMouseover
	- onMouseout
	- onMousemove
	- onMousedown
	- onMouseup

5. 键盘  

	- onKeydown
	- onKeyup
	- onKeypress//按下并释放
	- 页面必须有被聚焦的对象
	- ctrlKey
	- shiftKey
	- altKey
	- keyCode//获取键值

6. 默认事件  
比如页面鼠标右键`oncontextmenu`的弹出菜单,文本框输入内容等.  

		return false;//可以取消默认事件			

7. 拖拽
	1. 鼠标按下`onMousedown`后触发`document.onMouseover`(处理鼠标移动过快),使被拖拽的对象的`left`,`top`保持和鼠标位置距离`clientX``clientY`不变`(count=event.clientX-div.offsetLeft)`
	2. `onMouseup`后将其本身和`onMousemove`置空.(都是`document.`)
	3. `return false``onMousedown`的默认事件
	4. 鼠标当前位置-鼠标起始距离div边界的距离不能`<`0或`>doucumentElement.clientWidth-div.offsetWidth`,解决拖拽出窗口的问题

8. 事件绑定.捕获  
		
		attachEvent(事件名，函数)//IE.可以同时加多个函数到同一个事件
		addEventListener(事件名,函数,false)/Chrome,Firfox
		detachEvent(事件名，函数)
		removeEventListener(事件名,函数,false)//解除绑定
		obj.setCapture();//将页面所有位置的时间捕获到obj上//IE
		obj.releaseCapture();//接触捕获

## 事件委托
解决“事件处理程序过多”的问题。使用时间委托，只需在DOM树中尽量最高的层次上添加一个事件处理程序。
```
var list = document.getElementById("myLinks");
EventUtil.addHandler(list, "click", function(event){
event = EventUtil.getEvent(event);
var target = EventUtil.getTarget(event);
```
