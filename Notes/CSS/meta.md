#<meta>

## 定义
>HTML Meta 元素(`<meta>`) 用来表达任何其他 HTML 元相关元素 (`<base>, <link>, <script>, <style> 或者 <title>`) 等无法表达的信息。(MDN)  

Meta标签用于存储web页面上的信息,用户无法看到，但是浏览器可以解析。本质上讲,它是信息数据。他**帮助浏览器和搜索引擎更好地知道、理解页面内容**。

## 几种属性值  
- name  
一个 document 级的元素数据 将附着在整个页面上。
        <meta name=”参数” content=”具体的参数值”>
        
- http-equiv  
网络服务器将会给出一个 pragma directive, 即，指示页面应如何承载的指令信息。可以用来实现页面刷新，重新定向，设置服务器重新传输时间，cookie到期时间等。
        <meta http-equiv=”参数” content=”参数变量值”>

- charset  
将对网页使用的字符集作出声明.(推荐使用UTF-8）


- property=og：  
og是一种新的HTTP头部标记，即[Open Graph Protocol](https://developers.facebook.com/docs/sharing/webmasters),似乎是跟社交网络上的分享有关。由facebook提出，很多网站在用。  
不太理解meta标签在其中起到什么作用  
        <meta property="og:参数" content="参数值">

## 常见的用法
- 字符集声明，确定文档的编码
        <meta charset="UTF-8">
        
- 搜索引擎优化
        <meta name="keywords" content="搜索引擎搜索的关键字">
        
        <meta name="description" content="网页的内容，搜索之后结果里显示的简介">
        
        <meta name="author" content="作者">
        
- 浏览器的兼容性  
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        以最高的兼容模式显示,或者有谷歌内核的就用谷歌内核渲染。
        
- 移动端匹配  
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale：1,user-scalable=no,target-densitydpi=device-dpi">
        
- 和facebook的og相似，还有很多其他的类似的协议，也产生了其他各种appid之类的
        

