# Jquery全选按钮
最近做一个全选的按钮，才遇到了checkbox的checked的坑。checked属性设置为“checked”时，可以使checkbox的默认状态变为选中，如果不设置，则默认不选中，此时checked属性为undefined。手动点击checkbox改变其选中状态并不会改变该属性，要实现全选按钮就要通过js控制该属性，而使用attr来修改会非常麻烦（因为其未选中的返回值不是false而是undefined），不过jq有`.prop()`方法，可以方便的实现这个功能，代码参考如下：

~~~
//全选和取消全选
$("#selectAll").click(function() {
    $(".selectGoods").prop("checked", this.checked);
  });
//选中和取消选中各项，同时控制全选
  $(".selectGoods").click(function() {
    var $subs = $(".selectGoods");
    $("#selectAll").prop("checked" , $subs.length == $subs.filter(":checked").length ? true :false);
  });
~~~

`prop()`方法获取属性则统一返回true和false,通常我们在添加该属性名就会生效的属性和属性有true和false两个状态的属性中使用这个方法。

使用时需要注意下面三点（摘自黑暗执行绪）：
1. `$(window).attr()`, `$(document).attr()`建议改为`$(windows).prop()`, `$(document).prop()`，因为window及document理论上无从加上HTML Attribute，虽然jQuery 1.6.1在内部会偷偷改用.prop()，毕竟语意不合逻辑，应该避免。
2. 在HTML语法`<input type=”checkbox” checked=”checked” />`中，**checked Attribute只会在一开始将checked Property设成true，后续的状态变更及储存都是透过checked Property。换句话说，checked Attribute只影响初值，之后应以checked Property为准。**基于这个理由，$(“:checkbox”).prop(“checked”, true)会比$(“:checkbox”).attr(“checked”, true)来得合理。虽然jQuery 1.6.1已让$(“:checkbox”).attr(“checked”, true)也具有变更checked Property的能力，但prop()确实比attr()写法更吻合背后的实际运作。
3. 适用此点的Boolean属性包含了: ** autofocus, autoplay, async, checked, controls, defer, disabled, hidden, loop, multiple, open, readonly, required, scoped, selected**
