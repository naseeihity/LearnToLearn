## Cookie
HTTP Cookie,用于在客户端存储会话信息，其大小是有限制的，每个域下cookie的数量也是有限制的。如果担心单域名的cookie上限，可以通过子cookie来解决，但同时需更加注意单个cookie的长度。一般由服务器生成，如果在浏览器端生产，默认是关闭浏览器后失效。由于每次HTTP请求都要携带他，所以cookie的大小能小就小，现在多用于登录。

服务器
```
Set-Cookie: name=value
```
客户端
```
Cookie: name=value //键值都是经过url编码的
```

#### 构成
1. 名称,不区分大小写，经过URL编码
2. 值，经过URL编码
3. 域（domain），可以包含子域也可以不包含
4. 路径（path），可以设置cookie只有从某一个路径才能访问
5. 失效时间（expires），GMT格式的日期，用于指定应该删除cookie的准确时间，设置为空则在浏览器关闭时删除
6. 安全标志（secure），限制只有https的请求才能发送cookie，唯一一个非键值对写法

> 域、路径、失效时间和 secure 标志都是服务器给浏览器的指示,这些参数不会最为客户端发送到服务器的cookie的一部分

#### JavaScript使用
1. `document.cookie`可以拿到当前页面可用的所有cookie，也可是设置新的cookie，读取时需要用`decodeURIComponet()`来解码，设置时需要用encodeURIComponent()来编码。

```
document.cookie = encodeURIComponent("name") + "=" +
					encodeURIComponent("Nicholas") + "; domain=.wrox.com; path=/";
```

2. 由于其写法非常不直观，所以需要进行封装，其基本操作包括：读取，写入和删除。

```
var CookieUtil = {
	get: (name) => {
   		const cookieName = encodeURIComponent(name) + "=",
        	  cookieStart = document.cookie.indexOf(cookieName),
              cookieValue = null;
        
        if(cookieStar > -1){
        	const cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1){
            	cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
    },
    
    set: (name,value,expires,path,domain,secure) => {
    	const cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (expires instanceof Date) {
        	cookieText += "; expires=" + expires.toGMTString();
        }
        if (path) {
        	cookieText += "; path=" + path;
        }
        if (domain) {
			cookieText += "; domain=" + domain;
		}
        if (secure) {
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    },
    
    unset: (name,path,domain,secure) {
    	this.set(name, "", new Date(0), path, domain, secure);
    }
}
```

## sessionStorage
存储某个对话的数据，可以跨越页面的刷新存在，数据只能保留到页面关闭前。同时，他是和服务器某个会话绑定的，所以不支持本地文件，也只能由最初给他存储数据的页面访问到，所以多页面的应用也会有限制。一般用于会话中的小数据段，如果需要跨越会话，宜采用localStorage，他仅在客户端保存，不参与和服务器的通信。

#### 基本用法

```
=====写入数据======
//使用方法存储数据
sessionStorage.setItem("name", "Nicholas");
//使用属性存储数据
sessionStorage.book = "Professional JavaScript";

=====读取数据=====
//使用方法读取数据
var name = sessionStorage.getItem("name");
//使用属性读取数据
var book = sessionStorage.book;
=====删除数据=====
//使用 delete 删除一个值——在 WebKit 中无效
delete sessionStorage.name;
//使用方法删除一个值
sessionStorage.removeItem("book");
```

可以用于检测用户是否刷新当前的页面，以及可以在刷新后恢复音频，视频播放器的播放进度。

## localStorage
依然用于客户端的存储，但是他除非主动删除（通过js删除或用于清除浏览器缓存）否则会永久保存，他的访问遵守同源策略。在新tab打开同源页面，可以按到之前设置的localStorage。

#### 基本用法

```
//使用方法存储数据
localStorage.setItem("name", "Nicholas");
//使用属性存储数据
localStorage.book = "Professional JavaScript";
//使用方法读取数据
var name = localStorage.getItem("name");
//使用属性读取数据
var book = localStorage.book;
```

可以用于存储一些用户数据，缓解服务器压力，存储一些用户的访问轨迹，甚至可以存储一些不常更新的js，css文件。

## 应用缓存(AppCache)
在浏览器缓存中保存一部分数据，用法如下：
```
//offline.appcache 文件
CACHE MANIFEST
#Comment
file.js
file.css //需要缓存的文件

//html代码
<html manifest="/offline.appcache">

//API
ApplicationCache{
    status:0, //缓存状态，0-5分别表示，无缓存，闲置，检查中，下载中，更新完成。，废弃
    oncached:,
    ondownloading:,
    onerror:,
    onnoupdate:,
    onobsolete:,
    onprogress:,
    onupdateready:,
}
```

#### manifest存在的问题
- 第一次必须联网，且打开较慢
- 缓存文件一旦下载出错，后续文件将不在下载，抛出错误事件
- 引用manifest的html页面本身也会被缓存

## HTTP请求中的缓存问题

### 缓存规则
**过期机制**
1. 含有完整的过期时间控制头信息，仍在有效期内；(访问，刷新)
2. 浏览器已经使用过这个缓存版本，并且在一个会话中检查过新鲜度(后退)

**验证机制**
通过服务器返回资源同时携带的Etag(Entity Tag)进行校验，如果不匹配，就要重新获取资源内容。

### HTTP报头中与缓存有关的信息
**Expires** 
值为一个标准时间`Thu Oct 06 2016 18:01:31 GMT`,告诉浏览器过期时间前可以使用缓存。

**Pragma**
`no-cache`告诉浏览器忽略资源的缓存副本

**Cache-Control**
同时设置，优先级高于Expires。
- `no-cache` 会缓存但每次都需要请求服务器评估缓存的有效性
- `no-store` 不会缓存，强制缓存在任何情况下都不要保留副本
- `max-age=` 以秒为单位，之名缓存的有效时常
- `public` 任何途径的缓存者(本地，代理)都可以无条件缓存
- `private` 只有单个用户可以缓存(如则cdn不能缓存)

**Last-Modified**
值为标准时间，告诉浏览器当前资源的最后修改时间

**If-Modified-Since**
值为上一次请求响应头中的`Last-Modified`,如果其中的值和服务器中该文件最后修改时间相同，则返回304，浏览器便从缓存中加载该资源；如果不同，则重新下载该资源，并更新`Last-Modified`的值。

其优先值还是低于`Cache-Control/Expires`,即只要缓存在有效期内，就不会发送任何请求。但是这一项还是非常有用，因为当用户刷新页面时，浏览器会忽略缓存而继续向服务器发送请求，而这时利用304响应就能有效减少开销。另外，当用户使用`Ctr+F5`进行刷新时，则会忽略所有的缓存，强制重新下载资源。

**ETag**
有服务器生成的唯一标志符，**If-None-Match**存储上一次请求中的`ETag`。他能更加精准地控制缓存，服务器会优先验证它，然后对比Last-Modified，才决定是否返回304.

**唯一网址**
如果我们想废弃之前的缓存规则，比如在Cache-Control中我们设置了一天，但是突然我们更改了相关内容，希望用户通过地址栏进入的时候也能更改就无法实现了，这是我们就需要使用唯一的地址来更新我们的资源，一般的做法是在资源的文件名中嵌入**版本号**。

## 更多参考
1. [web缓存机制系列](http://www.alloyteam.com/2012/03/web-cache-1-web-cache-overview/)






