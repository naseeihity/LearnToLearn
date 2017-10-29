# arguments & apply

## arguments
他是javascript的一个内置**对象**,所有的函数都有属于自己的一个arguments对象,他包含了函数
所调用的参数,他实际上是函数的一个属性.他**不是**一个数组,虽然可以用调用数组的方法调用它,(arguments[0],arguments.length等),
但是push,pop等不适用.

----


### 把arguments对象转换成一个真正的数组  

	var args = Array.prototype.slice.call(arguments); 
变量`args`就是一个含有函数所有参数的标准javascript数组对象.

## apply
其第一个参数将获得调用该方法的对象的属性和方法.

		Function.apply(obj,args)方法能接收两个参数
		obj：这个对象将代替Function类里this对象
		args：这个是数组或者arguments，它将作为参数传给Function
		//在参数数量已知的情况下会用到call
		
### apply的妙用
实际上,apply会将一个数组转化成为一个参数列表,即将`[param1,param2,param3]` 转换为 `param1,param2,param3`.

1.  Math.max 可以实现得到数组中最大的一项(Math.min同理)  
因为`Math.max(param1,param2,param3…)`,其参数并不支持数组,而通过apply可以快速求得数组中的最大值.  

		var max=Math.max.apply(null,array)

2.  Array.prototype.push 可以实现两个数组合并(实际感觉并没有卵用,直接concat()就可以了)
因为push(param1,param,…paramN),所以也可以用apply来转换数组.  

		var arr1=new Array("1","2","3");
		var arr2=new Array("4","5","6");
		Array.prototype.push.apply(arr1,arr2); 
		
3.  用apply实现函数内部以arguments为参数的concat()数组拼接
因为`arrayObject.concat(arrayX,arrayX,......,arrayX)`,其中arrayX可以是具体的值，也可以是数组对象.  
然而,我们知道arguments是一个object(),而不是一个Array实例,因此下面的用法是错误的:  

		arr.concat(arguments)  
然而通过apply可以将arguments转化成一个参数列表,也就是一个一个具体的值,于是便能实现数组的拼接.下面给出一个例子:

		function test(){
			var a = [1,2,3];
			console.log(a.concat.apply(a,arguments));//[1,2,3,4,5,6]
			a = [1,2,3];
			console.log(a.concat(arguments));//[1,2,3,Arguments(3)]
		}
		test(4,5,6);
		//Arguments(3)是个什么鬼我也不知道.
