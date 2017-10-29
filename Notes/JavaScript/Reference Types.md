# 引用类型(Reference Types)的值的传递&全局变量
## note
1.变量若没有用var声明则为全局变量(无论是基本类型还是引用类型)  

2.函数的参数都是按值传递的.
- 基本类型是直接复制一个数值存入参数中.
- 引用类型则是复制一个指向原始值的指针,然后将该指针传入参数,所以是按引用传递的.  

3.函数的参数在函数调用结束后会被销毁.  

		function setName(obj){
			obj.name = "Bb";
			obj = new Object();
			obj.name = "Greg";
		}
		
		var person = new Object();
		setName(person);
		console.log(person.name);//'Bb'  
		
从上面这个函数可以看出,即使在函数内部修改了参数的值,但是原始的引用仍然保持不变.实际上,在函数内部重写obj时,这个变量引用的就是一个局部对象.而这个局部对象会在函数执行完毕后立即被销毁.(Javascript高级程序设计)

我的理解:把person的引用传递给obj后其name属性的赋值在第一步已经完成,之后又将参数obj指向了一个新的对象并对其进行了赋值,但这都与person没有关系了.这个新的值在函数内部是存在的,即:  

		function setName(obj){
			obj.name = "Bb";
			obj = new Object();
			obj.name = "Greg";
			console.log(obj.name);//'Greg'
		}
		
		var person = new Object();
		setName(person);
		console.log(person.name);//'Bb'  
		
容易混淆的地方:因为函数内部的`obj = new Object()`没有使用`var`来声明,以为他会变成一个全局变量,所以猜想  

		function setName(obj){
			obj.name = "Bb";
			obj = new Object();
			obj.name = "Greg";
			console.log(obj.name);//'Greg'
		}
		
		var person = new Object();
		setName(person);
		console.log(person.name);//'Bb'  
		console.log(obj.name);//('Greg')
		
实际上,并不会有该输出,程序会报错,提示是`obj is not defined`.想到,**可能因为obj同时也是函数的参数,在函数调用结束后会自动销毁.** 即高程中讲的*这个局部对象会在函数执行完毕后立即被销毁* 是因为这个局部对象是函数的参数.(或者说,因为它是函数的参数他才是个局部对象,而不会被提升为全局变量.)  

尝试修改变量名称  

		function setName(obj){
			obj.name = "Bb";
			oj = new Object();
			oj.name = "Greg";
			console.log(obj.name);//'Greg'
		}
		
		var person = new Object();
		setName(person);
		console.log(person.name);//'Bb'  
		console.log(oj.name);//'Greg'
可以正常输出"Greg".尝试用`var`在函数里对`oj`进行声明,得到  

		function setName(obj){
			obj.name = "Bb";
			var oj = new Object();
			oj.name = "Greg";
			console.log(obj.name);//'Greg'
		}
		
		var person = new Object();
		setName(person);
		console.log(person.name);//'Bb'  
		console.log(oj.name);//ReferenceError: oj is not defined
由此,可以验证,函数内没有用var声明的变量,对于引用类型值也会提升为全局变量.