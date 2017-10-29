## Question
>使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝。
>被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等。

## My answer
~~~
function cloneObject(src) {
    var cloneSrc;
    //判断值传递类型和null(null有被判断为object的bug)
    if(src == null || typeof(src)!="object" ){
        cloneSrc = src;
      return cloneSrc;
    }
    //返回数组对象
    else if(src instanceof Array){
        cloneSrc = [];
      return cloneSrc = src.slice(0);
    }
    //返回日期对象
    else if(src instanceof Date){
        return cloneSrc = new src.constructor(src.getTime());
    }
    //使用递归的方法（因为对象也可以作为对象的属性），将对象里的所有内容复制到新的对象
    else if(src instanceof Object){
        cloneSrc = {};
      for (var key in src){
        cloneSrc[key] = cloneObject(src[key]);
      }
      return cloneSrc;
    }
}

// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

console.log(abObj.a);
console.log(abObj.b.b1[0]);

console.log(tarObj.a);      // 1
console.log(tarObj.b.b1[0]);    // "hello"
~~~

##分析过程
所谓深度克隆（Deep Copy），其实很简单，只是基于Javascript的变量分为基本类型和引用类型，而引用类型的值在传递（赋值）的时候相当于传递的是指针，所以，如果改变了源对象的值，那么复制得到的新的对象的值也会被改变，这有时候是我们所不希望的，因此就有了深度克隆：对引用类型的对象进行相当于值传递的赋值操作。

1. 类型检查  
   - 使用typeof进行基本类型的检查。因为不知道传入的元素是什么类型的变量，所以先要进行类型的判断，对于非对象且不为null的变量直接进行值传递，就能实现复制(这一步也是实现后续递归复制对象内容的关键)。在Javascript中，null类型会被当作一个对象类型`typeof(null)`会返回`object`，这是语言本身的一个bug，null是一个基本类型。之所以会出现这样的问题，是因为Javascript中二进制前三位都为0的话就会被判断为object类型，null的二进制表示是全0，自然会被“误判”为`object`。
   - 对于对象类型依然需要分开讨论，这里我们只考虑Number对象和Date对象类型。我们使用instanceof检测变量属于什么类型的对象。
2. 特殊对象类型实现深度克隆
    - 对于数组类型，需要将其初始化为空数组（`[]`这也是他和对象不同的地方），然后用slice方法将数组内容复制进新数组；
    - 对于日期类型，实际上并不是进行了复制，而是计算出了相应的日期，所以就不存在引用类型的赋值的问题了。代码中`new src.constructor`和`new Date`是等效的，使用`src.getTime()`可以获得src距1970年1月1日之间的毫秒数。
3. 使用递归的方法实现一般对象的复制
    初始化对象为空对象`{}`,然后通过`for...in`语句实现对对象所有属性的遍历，通过递归将所有嵌套的属性也一一复制。整个复制都是顺着原型链进行的。

##其他实现方法
1. Json

    如果不考虑某些浏览器的兼容问题，现在Json的方法貌似是一个即简便又高效的方法。
    ~~~
        var newObject = JSON.parse(JSON.stringify(oldObject));
    ~~~
    不过，对于Date类型，由于Json返回的是一个String，得到的复制的新的Date对象不能进行相关Date计算，所以需要将其转换回Date对象类型：
    ~~~
        var newObject = new Date(JSON.parse(JSON.stringify(oldDateObject)));
    ~~~

2. Jquery
    ~~~~
        var copiedObject = jQuery.extend(true, {}, originalObject)
    ~~~~

##类型检测扩展
1. instanceof适用于检测变量属于具体的那种对象，对于不是对象的基本类型会返回false。
2. 使用constructor可以返回一个检测对象的构造函数，能够得到更加具体的结果，数组就是`function Array()`,函数是`function Function()`
3. 安全的类型检测
        Object.prototype.toStrng(value);//例如对于value为数组会返回“[object Array]”

##参考资料
1. [火狐MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
2. [stackoverflow_1](http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object)
3. [stackoverflow_2](http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object/728694#)
4. [stackoverflow_Date](http://stackoverflow.com/questions/11491938/issues-with-date-when-using-json-stringify-and-json-parse/11491993#11491993)