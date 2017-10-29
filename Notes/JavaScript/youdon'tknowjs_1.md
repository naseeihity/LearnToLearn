# 你不知道的JavaScript（中）

## 类型
### 1. 内置类型
- null
- undefined
- boolean
- number
- string
- object(引用类型)
- symbol(新增，属于基本类型)

### 2. typeof的安全防范机制
typeof对于**没有声明**和**没有赋值**的变量的返回值都为`undefined`。如果我们有一个全局变量要在生产环境中使用，但是在线上不使用，此时就需要用typeof去检查他是否存在了。

```
// 这样会抛出ReferenceError错误
if (DEBUG) {
    console.log( "Debugging is starting" );
}

// 这样是安全的
if (typeof DEBUG !== "undefined") {
    console.log( "Debugging is starting" );
}

// 也可以做到，但是不能保证全局对象总是window
if (window.DEBUG) {
    // ..
}
```


## 值
### 1. 数组
- 通过delete删除数组中的元素不会改变数组的length
- 数组中如果有元素未赋值，其值将为undefined，但这也与`a[1] = undefined`是有区别的
- `a['foo'] = 1` 这样的数组的值的表示方法并不会计入数组的长度，但如果键名里的字符串可以被强制类型转换成数组的话就会被当作数组索引来处理。**不建议这样来使用数组**

#### 1.1 类数组
一些DOM元素列表，通过arguments对象来访问函数的参数(ES6中已经废止，用`...`运算符代替)。

类数组转换成数组：

```
var arr = Array.prototype.slice.call( arguments );
// ES6
var arr = Array.from( aruguments );
```


### 2. 字符串
- 字符串是**不可变的**:字符串的成员函数不会改变其原始值，而是创建并返回一个新的字符串。(而数组的成员函数都是在其原始值上操作的)

#### 2.1 常用处理字符串的数组函数

```
a.join;         // undefined
a.map;          // undefined

var c = Array.prototype.join.call( a, "-" );
var d = Array.prototype.map.call( a, function(v){
    return v.toUpperCase() + ".";
} ).join( "" );

c;              // "f-o-o"
d;              // "F.O.O."
```

但是，我们不能使用相同的方法去实现字符串的反转(数组的reverse()函数)，因为字符串的成员是不可变更的，但可以使用下面的暴力方法：

```
// 将字符串转成数组反转后再转会字符串，但对于复杂字符 Unicode 则需要相关的工具库来实现
var c = a
    // 将a的值转换为字符数组
    .split( "" )
    // 将数组中的字符进行倒转
    .reverse()
    // 将数组中的字符拼接回字符串
    .join( "" );
    
```

### 3. 数字
- 使用`tofixed()`来指定小数部分的显示位数，返回值为数字的字符串形式
- 使用`toPrecision()`来制定有效位数
- 0x，0o，0b分别表示十六进制，八进制，二进制
- 使用Number.EPSILON来比较两个浮点数是否相等(制定误差范围)

	```
    
    function numbersCloseEnoughToEqual(n1,n2) {
    	return Math.abs( n1 - n2 ) < Number.EPSILON;
	}
    var a = 0.1 + 0.2;
    var b = 0.3;
    numbersCloseEnoughToEqual( a, b );                  // true
    numbersCloseEnoughToEqual( 0.0000001, 0.0000002 );  // false
    ```
 
### 4. 特殊数值
- 区别null和undefined，null不可以被当作变量来使用和赋值，而undefined可以
- 使用`void 0`来得到undefined，void运算符可以使表达式不返回值
- NaN，指数学运算没有成功，返回了错误的结果，变量仍可能是number类型的，他是唯一不等于自身的值

	```
    var a = 2 / "foo";      // NaN
	typeof a === "number";  // true
    // 不能用NaN去判断一个变量是不是一个数字，NaN与任何值，包括自身，比较都是false
    var a = 2 / "foo";
    a == NaN;   // false
    a === NaN;  // false
    // 可以使用isNaN，但是他只是检查变量是否不是NaN也不是数字，所以有个bug
    isNaN( a ); // true
    b; "foo"
    window.isNaN( b ); // true——晕！
    // ES6的写法
    Number.isNaN(b);// false
    ```

- 计算结果一旦溢出为无穷数，就无法再得到有穷数
- -0在需要以向量形式表示一些值的时候很重要
- 在ES6中可以使用`Object.is()`来判断两个值是否绝对相等(比===更加准确),主要用于判断正负0和NaN。

### 5. 值和引用

```
function foo(x) {
    x.push( 4 );
    x; // [1,2,3,4]

    // 然后
    x = [4,5,6];
    x.push( 7 );
    x; // [4,5,6,7]
}
var a = [1,2,3];
foo( a );
a; // 是[1,2,3,4]，不是[4,5,6,7]
```

- `slice(..)` 不带参数会返回当前数组的一个浅复本
- 值的类型决定了他的传递方式


## 原生函数
- 前几个不到万不得已不要使用
- String()
- Number()
- Boolean()
- Array()
- Object()
- Function()
- RegExp()  // 在动态定义正则表达式时会很有用
- Date()
- Error()
- Symbol()


```
var a = new String( "abc" );
typeof a;                            // 是"object"，不是"String"
a instanceof String;                 // true
Object.prototype.toString.call( a ); // "[object String]"
```

## 强制类型转换
- toString(); // 数组的该方法被重新定义，使用‘，‘连接每一项
- JSON.stringify(); // JSON转字符串，它并不是强制类型转换
- 使用Date.now()来获得当前的时间戳，使用new Date(..).getTime()获得指定时间的时间戳
- 因为～-1可以得到0,所以可以利用～和`indexOf()`实现将结果强制类型转换为真假值，他要比`indexOf(..) >= 0`之类的更加简洁
- `~~`可以用来截除Int32的小数部分，但是他在处理负数是和floor是有区别的，例如对-49.6,他会得到-49，同样使用x|0也可以达到截除小数的目的
- 避免向praseInt传递非字符串
- 建议使用Boolean(a) 和 !!a 来进行显式强制类型转换为boolean型
- Symbol 类型的隐式类型转换会产生错误
- == 允许在相等比较中进行强制类型转换，而 === 不允许
- `typeof x == 'function'` 是绝对安全的，因为不可能返回空值或boolean值
- 七个大坑

	```
    "0" == false;          // true -- 晕！
	false == 0;            // true -- 晕！
	false == "";           // true -- 晕！
	false == [];           // true -- 晕！ //![]也是false，!![]是true
	"" == 0;               // true -- 晕！
	"" == [];              // true -- 晕！
	0 == [];               // true -- 晕！
    ```

## 语法

- 利用赋值语句的副作用来简化代码

	```
    function vowels(str) {
        var matches;

        // 提取所有元音字母，少写一个if
        if (str && (matches = str.match( /[aeiou]/g ))) {
            return matches;
        }
	}
	vowels( "Hello World" ); // ["e","o","o"]
    ```
- JSON本身并不是合法的JavaScript语法，JSONP能将JSON转为合法的JavaScript语法。
- JavaScript中并没有`else if`,只是因为else后只有一个单独的if语句，所以可以省略大括号
- &&运算符优先于||，且优先于左右顺序([优先级](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence))
-  ES6中定义了一个新概念TDZ（暂时性死区）

	```
    {
    typeof a;   // undefined
    typeof b;   // ReferenceError! (TDZ)
    let b;
	}
    ```


















