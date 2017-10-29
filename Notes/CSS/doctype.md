# doctype

## 什么是doctype  
>DOCTYPE标签是一种标准通用标记语言的文档类型声明，它的目的是要告诉标准通用标记语言解析器，它应该使用什么样的文档类型定义（DTD-Document Type Definition）来解析文档。


即`<!DOCTYPE>`是指示web浏览器关于页面使用哪个**HTML版本**进行编写指令。  

他位于`<html>`标签之前，对大小写不敏感，本身是一个声明，并不是一个html标签。  

`<!DOCTYPE>` 声明是必须的，否则[Quirks模式](https://developer.mozilla.org/en-US/docs/Mozilla_Quirks_Mode_Behavior)进行处理（浏览器按照自己的解析标准进行，各个浏览器就会有很大差异），该模式与标准模式在盒模型、样式、布局等都存在较大差异。

## doctype的发展
doctype起初是用于xml中，用于描述允许使用的元素、属性和排列方式等，HTML借鉴了其中的用法，并赋予新的用法形成了自己的规范，之前版本的html,xml等的doctype声明都比较复杂，要写上相应的dtd文件地址，而且还有各种模式，非常麻烦。  

HTML5之后，使用`<!DOCTYPE html>`进行声明即可。  

## doctype在javascript中  
在写有doctype声明的html网页上，他的`document.firstchild`或`document.childNodes[0]`是<!DOCTYPE html>（谷歌）/[object DocumentType]（火狐）,而不是`<html>`.  

也可以通过`document.doctype`来获得。

## 更多参考
1.[w3c](http://validator.w3.org/docs/sgml.html)  
2.[Mozilla MDN](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)