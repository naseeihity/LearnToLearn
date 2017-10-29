# 你不知道的JavaScript——异步和性能

## 异步
- 控制台的I/O异步，有可能会产生延迟的输出
- 回调函数实现异步的写法不符合大脑的思维习惯，代码变得难以理解且会产生控制反转

## Promise
- Promise决议后就是外部不可变的值，可以安全地传给第三方并确信它不会被有意无意地修改
- Promise将回调安排给了一个可信任的中间机制，解决了控制反转的问题
- Promise 调用 then(..) 的时候，即使这个 Promise 已经决议，提供给 then(..) 的回调也总会被异步调用，防止了竞态条件的产生
- 一个 Promise 决议后，这个 Promise 上所有的通过 then(..) 注册的回调都会在下一个异步时机点上依次被立即调用，即他们不会影响其他回调的调用

	```
    p.then( function(){
        p.then( function(){
            console.log( "C" );
        } );
   		console.log( "A" );
	} );
	p.then( function(){
    	console.log( "B" );
	} );
	// A B C
    ```
    
- Promise.resolve(..) 提供了可信任的 Promise 封装工具，可以链接使用,Promise.resolve(..) 会将传入的真正 Promise 直接返回，对传入的 thenable 则会展 开：

	```
    Promise.resolve( foo( 42 ) )
	.then( function(v){
    	console.log( v );
	});
    ```
    
### Promise链式流
- 调用 Promise 的 then(..) 会自动创建一个新的 Promise 从调用返回
- 在完成或拒绝处理函数内部，如果返回一个值或抛出一个异常，新返回的（可链接的）Promise就相应地决议
- 如果完成或拒绝处理函数返回一个 Promise，它将会被展开，这样一来，不管它的决议值是什么，都会成为当前 then(..) 返回的链接 Promise 的决议值
- 在链式流中可以实现每一步都有异步能力：

	```
    var p = Promise.resolve( 21 );
    p.then( function(v){
        console.log( v );       // 21

        // 创建一个promise并返回
        return new Promise( function(resolve,reject){
            // 引入异步！
            setTimeout( function(){
                // 用值42填充
                resolve( v * 2 );
            }, 100 );
        } );
    } )
    .then( function(v){
        // 在前一步中的100ms延迟之后运行
        console.log( v );       // 42
    } );
    ```
    
- 我们可以将一些本身不支持Promise的工具进行（如`ajax()`）进行promise化，如果调用过程中有错误，可以在then的第二个参数中写入reject函数去捕捉错误，即使没有写错误也会继续随着promise链传下去直到遇到显示的处理错误函数

	```
    // 假定工具ajax( {url}, {callback} )存在
    // Promise-aware ajax
    function request(url) {
        return new Promise( function(resolve,reject){
            // ajax(..)回调应该是我们这个promise的resolve(..)函数
            ajax( url, resolve );
        } );
    }
    
    request( "http://some.url.1/" )
    .then( function(response1){
        return request( "http://some.url.2/?v=" + response1 );
    } )
    .then( function(response2){
        console.log( response2 );
    } );
    ```
    
### Promise的写法
1. 声明

```
var p = new Promise( function(resolve,reject){
    // resolve()用于完成，为promise设定最终值
    // reject()用于表示操作被拒绝
} );
```
这里用resolve而不用fulfill是因为，第一个参数返回的并不一定是一个完成的promise，仍有可能返回拒绝的promise，例如：

```
var rejectedPr = new Promise( function(resolve,reject){
    // 用一个被拒绝的promise完成这个promise
    resolve( Promise.reject( "Oops" ) );
} );

rejectedPr.then(
    function fulfilled(){
        // 永远不会到达这里
    },
    function rejected(err){
        console.log( err ); // "Oops"
    }
);
```

2. .then()中的参数名称

```
p.then(
    fulfilled,//因为必定是完成的
    rejected
);
```
ES6 规范将这两个回调命名为 onFulfilled(..) 和 onRjected(..)。

### 错误捕捉
promise中可以使用reject捕捉promise失败的错误，但是如果成功的promise已经进入了resolve函数中，这时候出现错误我们就无法通过reject捕捉到了，而是需要另外一个`.then`

我们可以通过在尾部加上一个`.catch`来捕捉错误，但是还是不能保证其中的错误处理函数是正确的，这基本是和死循环。

目前可以用的思路是在全局注册一个处理‘未处理的拒绝’的函数的定时器，在拒绝的时候启动，如果在定时器设定的时间内未启动，就假定不处理这个错误。

但是，目前并没有一个很好的处理方法。




