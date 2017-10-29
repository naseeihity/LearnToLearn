# Ajax
异步请求，局部刷新

## XHR

```
function ajax(url,fnSucc,fnFaild){
	var oBtn = document.getElementById('btn1');
	oBtn.onclick = function(){
		//第一步：创建ajax对象
		var oAjax =  new XMLHttpRequest();

		//连接服务器
		//open(方法,文件名,异步传输)false为同步
		//同步:事件一件一件来;异步:多个事情一起做
		oAjax.open('GET','url','true');
        //对于POST请求，要在中间件加上
        //request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		//发送请求
		oAjax.send();

		//接受返回
		oAjax.onreadystatechange = function(){
			//浏览器和服务器进行到哪一步了
			if(oAjax.readyState ==4){//读取完成
				if(oAjax.status == 200){ //读取成功
					fnSucc(oAjax.responseText);
				}
				else{
					if(fnFaild){
						fnFaild(oAjax.status);
					}
				}
			}
		}

	}
}
```

XMLHttpRequest(XHR)对象：Ajax的核心，使得后台和服务器可以在不刷新页面的情况下进行实时的数据交换。

### XHR取得的响应
1. responseText：获取字符串形式的响应数据
2. responseXML：现在一般获取JSON数据
3. status和statusText：以数字和文本形式返回的HTTP状态码
4. getAllResponseHeader()：获取所有的相应报头
5. getResponseHeader():查询相应中的某个字段的值
6. readyState 用来确定请求进行到哪一步了；0表示请求初始化，open还没有调用；1表示连接已经建立，open已经调用；2表示请求已经接收；3已经在处理响应；4表示响应已经完成。使用onreadystatechange来监听他的变化。

### Jquery中使用

~~~
$.ajax({
	type:"POST",
	url:"http://aaa.com",
	dataType:"json",//期望的返回值的类型
	contentType://代表请求头中的content-type
	success:function(){
	
	},
	error:function(){

	}
});
~~~

### 使用promise完成ajax

```
function request(url) {
  return new Promise( function(resolve,reject){
      $.ajax({
            url: url,
            type: 'PUT',
            data: ,
            success: function(data){
                resolve(data);
            },
            error: function(error){
                reject(error);
            }
        });
  } );
}

const myAjax = request("www.gaococ.com");
myAjax.then( function(response1){
  return request( "http://some.url.2/?v=" + response1 );
} ).then( function(response2){
  console.log( response2 );
} );
```

### 使用fetch

```
fetch(url,{method:"POST",headers:xxx,body:xxx}).then(response => response.json())
  .then(data => console.log(data))
  .catch(e => console.log("Oops, error", e))
```

## HTTP

### HTTP请求的7个步骤
1. 建立TCP连接
2. Web浏览器向服务器发送请求命令
3. 浏览器发送请求头信息（只有POST,PUT,PATCH会包含请求体）
4. 服务器应答
5. 服务器发送请求头信息
6. 服务器向浏览器发送数据
7. 服务器关闭TCP连接

### HTTP请求头
- **Accept** 浏览器接受的内容类型(`text/css,text/html,image/*,*/*`)
- **Accept-Encoding** 浏览器能够处理的压缩编码类型 (如gzip，一般在服务器配置，对相关资源进行压缩)
- **Connection** 浏览器与服务器建立的连接类型，表示是否需要持久连接，可以设置为close，HTTP1.1默认为keep-alive，避免了不断建立/关闭连接（TCP）的开销，一般通过`Transfer-Encoding: chunked`来判断传输是否完成。
- **host** 发出请求的页面所在的域
- **referer** （搞笑的是规范中这个单词referrer拼写错了）发出请求的页面的URI(统一资源标志符URI=URL(地址)+URN(身份))
- **cookie** 当前页面的所有cookie信息
- 各种缓存相关的头
- **User-Agent** 浏览器的用户代理字符串，例如`Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36`
- **Content-type** 请求体对应的MIME(Multipurpose Internet Mail Extensions,多用途互联网邮件扩展)信息，即请求体传输数据的格式
	+ *application/json* 传输的数据是序列化后的JSON字符串
	+ *application/x-www-form-urlencoded* 原生的表单提交格式，`key1=val1&key2=val2`,jquery的默认值
	+ *multipart/form-data* 上传文件，图片
	+ *text/xml* 上传xml格式的数据

### HTTP请求的四个组成
1. 方法或动作：GET POST PUT
2. 请求的URL
3. 请求头，包含客户端环境信息，身份验证信息，一般会和请求体有一个空行
4. 请求体，提交的查询字符串，表单信息等

### GET和POST，PUT
1. GET 用于获取信息，使用URL传递参数，一般只用来查询获取，不用来改变，数量一般限制在2000字符左右。幂等：查询次数不影响信息本身。
2. POST 发送信息，用来修改服务器上的资源，值会被嵌入到HTTP请求体中，用户不可见
3. 改变数据状态，无论请求多少次，结果都一样
4. PATCH作用同PUT，但是其操作不是幂等的，即多次改变的结果是不同的

### HTTP响应
1. 一个数字和文字组成的状态码，显示请求成功与否
2. 响应头，服务器端的信息
3. 相应体，传回来的内容

### HTTP状态码
1.1XX:信息类，表示浏览器请求正在进一步处理中
2.2XX：成功，表示请求被成功接收如200
3.3XX：重定向，要么没有成功，要么没有新内容（304）
4.4XX：客户端请求有错误，如404因为这所请求的文档不存在
5.5XX：服务器错误，服务器不能完成对请求的处理，如500

### HTTP的演进
#### HTTP1.1

- 支持持久连接，一个TCP连接可以传递多个HTTP请求和响应，且不用等待上一次响应的结果就能放出下一次请求。
- 增加了Host请求头，以此实现了在一台WEB服务器上可以在同一个IP地址和端口号上使用不同的主机名来创建多个虚拟WEB站点。
- 通过`RANGE:bytes=XXXX`实现了对断点续传的支持

#### HTTP2
- 允许通过单一的HTTP/2连接，发起多重的请求响应消息，以此解决了浏览器向同一域名统一端口发出并行HTTP请求数量的限制问题
- 在应用层和传输层之间增加了二进制分帧层，对传输信息进行二进制编码，提高传输效率
- 使用HPACK 算法对请求首部进行了压缩
- 服务器可以对客户端的一个请求发出多个响应

#### HTTPS
使用SSL/TLS协议对传输进行加密，大概过程如下：

1. 浏览器将自己支持的一套加密规则发送给网站。

2. 网站从中选出一组加密算法与HASH算法，并将自己的身份信息以证书的形式发回给浏览器。证书里面包含了网站地址，加密公钥，以及证书的颁发机构等信息。

3. 获得网站证书之后浏览器要做以下工作：
- 验证证书的合法性（颁发证书的机构是否合法，证书中包含的网站地址是否与正在访问的地址一致等），如果证书受信任，则浏览器栏里面会显示一个小锁头，否则会给出证书不受信的提示。
- 如果证书受信任，或者是用户接受了不受信的证书，浏览器会生成一串随机数的密码，并用证书中提供的公钥加密。
- 使用约定好的HASH计算握手消息，并使用生成的随机数对消息进行加密，最后将之前生成的所有信息发送给网站。

4. 网站接收浏览器发来的数据之后要做以下的操作：
- 使用自己的私钥将信息解密取出密码，使用密码解密浏览器发来的握手消息，并验证HASH是否与浏览器发来的一致。
- 使用密码加密一段握手消息，发送给浏览器。

5. 浏览器解密并计算握手消息的HASH，如果与服务端发来的HASH一致，此时握手过程结束，之后所有的通信数据将由之前浏览器生成的随机密码并利用对称加密算法进行加密。

## 参考
[面试时如何优雅的谈论HTTP／1.0／1.1／2.0](http://www.jianshu.com/p/52d86558ca57/comments/3560156)
