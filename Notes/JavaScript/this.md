# 你不知道的Javascript学习笔记（一）——this

> this是在函数被调用时发生的绑定，他指向什么完全取决于 **函数在哪里被调用**。

## this的绑定规则
1. 默认绑定
直接使用不带任何修饰的函数引用进行调用，只能使用默认绑定，this指向全局对象。(只有在非严格模式下运行时才是这样)在严格模式下，this的默认绑定与函数的调用位置无关：  
~~~
"use strict";
function foo(){
    console.log(this.a);
}
var a=2;
(function(){
    var a=4;
    foo();//2
    })();
~~~

2. 隐式绑定
当函数引用有上下文对象时，this绑定到这个上下文对象。上下文引用链中只有最后一层会影响调用位置。
~~~
function foo(){
    console.log(this.a);
}

var obj2={
    a:42,
    foo:foo
};
var obj1={
    a:2,
    obj2:obj2
};

obj1.obj2.foo();//42
~~~

3. 显式绑定
通过call和apply方法的第一个参数指定this的绑定对象。
- 硬绑定
硬绑定的一个典型应用场景就是创建一个包裹函数，传入所有的参数并返回接收到的所有的值：
~~~
function foo(something){
    console.log(this.a,something);
    return this.a+something;
}

var obj={
    a:2
};

var bar = function(){
    return foo.apply(obj,arguments);
};//硬绑定，等效于
var bar = foo.bind(obj);

var b = bar(3);//2 3
console.log(b);//5
~~~

4. new绑定
javascript中，构造函数只是使用new操作符时被调用的函数，他们不属于某个类，也不会实例化为一个类。
使用new来发生构造函数调用会执行下面的操作：
- 创建一个全新的对象
- 新对象会被执行原型连接
- 新对象会绑定到函数调用的this
- 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。
~~~
function foo(a){
    this.a = a;
}

var bar = new foo(2);
console.log(bar.a);
~~~

### 绑定优先级与例外
1. 优先级
>4-3-2-1
2. 例外
- 把null或undefined作为this绑定的对象传入call,apply,bind时，会引用默认绑定
~~~
function foo(a,b){
    console.log("a:"+a+",b:"+b);
}

//空对象，可以更安全地使用this为空
var nope = Object.create(null);
//把数组展开成参数
foo.apply(nope,[2,3]);//a:2,b:3

//使用bind()进行柯里化
var bar = foo.bind(nope,2);
bar(3);//a:2,b:3
~~~

- 间接引用
最容易发生在赋值时，会应用默认绑定
~~~
function foo(){
    console.log(this.a);
}

var a=2;
var o={a:3,foo:foo};
var p={a:4};

o.foo();//3
(p.foo=o.foo)();//2
~~~

- 软绑定
给默认绑定指定一个全局对象和undefined以外的值，且可以通过其他绑定方法修改this.

- 箭头函数
继承外层函数调用的this绑定。

