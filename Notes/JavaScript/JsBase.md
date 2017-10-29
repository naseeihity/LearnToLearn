# JS基础知识
##### 一些别的语言没有的方法属性等。
-------

##1. 常用的（控制台）命令
- console.log();*控制台输出*
- prompt(text,defaultText);*弹出框输入*
- 'use strict'*尽量在strict模式下写代码*

##2. Javascript蛋疼/舒服用法
- 变量若没有用var声明则为全局变量（循环语句中尤其容易出问题）**不要这样用**  
- 字符串是不可变的

		var s = 'Test';
		s[0] = 'X';
		alert(s); // s仍然为'Test'
- 基本数据类型数组中可以有多种数据类型（数字，字符，布朗型等）
- 1/3 === (1-2/3);//false
- 用var声明并赋值一些函数，对象的时候在大括号后面**加分号**
- 对象的声明中，不同属性用**逗号**分隔，而不是分号，且在最后一项后不需要加逗号.
- 函数体中,javascript会将所申明的变量提升到顶部.
- 由于JavaScript的变量作用域实际上是函数内部，我们在for循环等语句块中是无法定义具有局部作用域的变量的.  
新标准中增加了用let替换var实现块级作用域的变量声明.
- 要保证this指向正确，必须用obj.xxx()的形式调用.

##3. 一些字符串方法
**调用这些方法本身不会改变原有字符串的内容，而是返回一个新字符串.**  

1.  substring  
返回从下标start开始,到下标end之前的字串. 

		strVariable.substring(start, end)  
example:  

		var s = 'hello, world'
		s.substring(0, 5); // 从索引0开始到5（不包括5），返回'hello'
		s.substring(7); // 从索引7开始到结束，返回'world' 		

2. indexOf  
返回 String 对象内第一次出现子字符串的字符位置。

		strVariable.indexOf(substring, startindex)//startindex缺省时则从字符串首开始寻找

3. toUpperCase/toLowerCase  
大小写转换

		var s = 'Hello';
		s.toUpperCase(); // 返回'HELLO'

4. split  
把一个字符串分割成字符串数组
		stringObject.split(separator,howmany)
		separator 	必需。字符串或正则表达式，从该参数指定的地方分割 stringObject。
		howmany 	可选。该参数可指定返回的数组的最大长度。如果设置了该参数，返回的子串不会多于这个
					参数指定的数组。如果没有设置该参数，整个字符串都会被分割，不考虑它的长度。	
                    
                    	
##4. 一些数组(Array)的方法
1. slice  
截取Array的部分元素，然后返回一个新的Array.

		var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
		arr.slice(0, 3); // 从索引0开始，到索引3结束，但不包括索引3: ['A', 'B', 'C']
		arr.slice(3); // 从索引3开始到结束: ['D', 'E', 'F', 'G']

2. splice  
从指定的索引开始删除若干元素，然后再从该位置添加若干元素

		var arr = ['Microsoft', 'Apple', 'Yahoo', 'AOL', 'Excite', 'Oracle'];
		// 从索引2开始删除3个元素,然后再添加两个元素:
		arr.splice(2, 3, 'Google', 'Facebook'); // 返回删除的元素 ['Yahoo', 'AOL', 'Excite']
		arr; // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
		// 只删除,不添加:
		arr.splice(2, 2); // ['Google', 'Facebook']
		arr; // ['Microsoft', 'Apple', 'Oracle']
		// 只添加,不删除:
		arr.splice(2, 0, 'Google', 'Facebook'); // 返回[],因为没有删除任何元素
		arr; // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
		
    **当只有一个参数时，效果相当于保留原数组从该参数下标开始的所有元素**  

3. join  
把当前Array的每个元素都用指定的字符串连接起来，然后返回连接后的字符串.  
如果Array的元素不是字符串，将自动转换为字符串后再连接。  

		var arr = ['A', 'B', 'C', 1, 2, 3];
		arr.join('-'); // 'A-B-C-1-2-3'

4.其他  
- a.toString()
- a.concat(item1[, item2[, ...[, itemN]]])
- a.pop()
- a.push(item1, ..., itemN)
- a.reverse()
- a.shift()
- a.sort([cmpfn])
- a.unshift([item])

[详见Array方法完整文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

##5. 对象  
声明的方法:

		var myObject = {
			key1:value1,
			key2:value2,
			...
			keyn:valuen
			};
			
		var myObject = new Object();
		myObject.key1 = value1;
		...
		
函数也是一个对象,对象里的方法也可以是函数.  

		function myObject(x,y){
			this.x=x;
			this.y=y;
			this.z = function(){
				return this.x*this.y;
				};//每次创建一个myObject对象时都会穿件这个新的函数对象
		}
		var num = new myObject(x,y);//声明一个函数对象
		var z = num.z();//返回对象的一个key的值
对这种方法进行改进:  

		function myObject(x,y){
			this.x=x;
			this.y=y;
		}
		myObject.prototype.z =  function(){
			return this.x*this.y;
			}//myObject.prototype 是一个可以被myObject的所有实例共享的对象

所有对象都能继承objec中的属性(tostring等),  
使用**in**可以判断某属性是否属于该对象,  
使用**hasOwnProperty()**方法可判断某属性是否为对象自身拥有而非继承自object的.

---------
1. 访问对象属性的方法  

		alert(person["name"]);
		alert(person.name);  
一般情况下,建议使用点表示法.在以下情况下只能使用方括号法:  
  - 属性名使用关键字或保留字甚至包含会导致语法错误的字符(空格等).
  - **通过变量来访问属性**    
  
			for(var keys in Object){
				console.log(Object[keys]);
			}
2. apply 和 call 的区别  
call()方法接受的是若干个参数的列表，而apply()方法接受的是一个包含多个参数的数组.    
在一个子构造函数中，你可以通过调用父构造函数的 call 方法来实现继承.  
参见:  
[Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)  
[Function.prototype.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)  

[函数柯里化](http://segmentfault.com/a/1190000003733107)