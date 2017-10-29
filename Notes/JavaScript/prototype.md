# 对象原型与继承

## 面向对象
> 对象是无序属性的集合，为引用类型，对象字面量为创建对象的首选模式。

#### 修改对象属性的默认特性 `Object.defineProperty()`
```
var person = {};
Object.defineProperty(person, "name", {
    writable: false,
    value: "Nicholas",
    configurable: false,//能否通过delete删除属性
    enumerable: true,//表示能否通过for-in循环返回属性
    get: function(){},
    set: function(){}//用于自定义读取和写入对象时执行的函数
});
```

#### 使用构造函数创建对象

```
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        alert(this.name);
    };
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

发生构造函数调用时，会执行下面的操作：
1. 创建一个全新的对象；
2. 这个对象会被执行原型链接；`newObject.__proto__ === constructObject.prototype`
3. 新对象会绑定到函数调用的this；
4. 如果函数没有返回其他对象，那么new表达式中的函数会自动返回这个新对象。

使用构造函数生成的对象，其构造函数属性指向该对象`person1.constructor === Person`，同时`Person.prototpye.constructor === Person`，因此在进行类型检测时，还是应该使用`instanceof`。

显示原型`prototype`用于实现原型的继承和属性的共享，而隐式原型`__proto__`同样能实现继承，同时原型链也是基于他实现的，如果在当前obj找不到某个属性，就会沿着他继续查找。

- 组合使用原型模式和构造函数模式

```
function Person(){
    this.init = 1;
}
Person.prototype = {
    constructor : Person,//因为prototype被重写，所以需要显示指定constructor
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    sayName : function () {
        alert(this.name);
}
var person1 = new Person();
};
```

#### 基于类的继承和基于原型的继承的比较
|             基于类的继承             |     基于原型的继承     |
|--------------------------------------|------------------------|
| 类是不可变的，运行时无法添加新的方法 | 原型是灵活的           |
| 不支持多重继承                       | 可以继承多个对象       |
| 复杂，需要使用接口抽象类等           | 简单，就是对对象的扩展 |

#### 使用构造函数的原型继承与使用原型的原型继承
只使用原型继承的问题：
在一个实例中修改一个属性，会同时影响到其他共享该属性的实例；创建子类型的实例时不能向超类型的构造函数中传递参数。

只使用构造函数继承的问题：
所有方法都在构造函数中定义，难以复用；超类型中定义的方法在子类型中不可见，所有类型都只能使用构造函数模式。

|              构造模式             |                    原型模式                    |
|-----------------------------------|------------------------------------------------|
| 函数式编程无法与其中的new一起使用 | 函数式编程可以与create结合使用                 |
| 忘记使用new会导致this的错误       | 由于create是一个函数，this总是能指向期望的地方 |
| 其原型继承复杂并且混乱            | 原型继承简洁易懂                               |

- 构造函数的原型继承（组合继承）

```
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function(){
    alert(this.name);
};
function SubType(name, age){
    //继承属性
    SuperType.call(this, name);
    this.age = age;
}
//继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
    alert(this.age);
};
var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //"Nicholas";
instance1.sayAge(); //29
var instance2 = new SubType("Greg", 27);
alert(instance2.colors); //"red,blue,green"
instance2.sayName(); //"Greg";
instance2.sayAge(); //27
```

- 原型式继承
包含引用类型的属性始终会共享相应的值。

```
var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};
var anotherPerson = Object.create(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");
var yetAnotherPerson = Object.create(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");
alert(person.friends); //"Shelby,Court,Van,Rob,Barbie"
```

#### 实现`extend`方法（混入mixin）
克隆并扩展一个对象，并能设置是否覆盖原有属性，类似ES6的assign方法。

```
Object.prototype.extend = function(...extensionObj,override){
    const hasOwnProperty = Object.hasOwnProperty;
    const len = arguments.length;
    const index = len - 1;
    let object = Object.create(this);

    while(index){
        const extensionObj = argements[len - (index--)];
        for(let property in extensionObj){
        if(hasOwnProperty.call(extensionObj,property) ||
            typeof object[property] === 'undefined'){
                if(object[property] !== 'undefined'){
                    if(override){
                        deepClone(extension[property],object[property]);
                    }
                } else {
                    deepClone(extension[property],object[property]);
                } 
            }
        }
    }
}
```

#### `instanceof`的实现

```
Object.prototype.instanceof = function(prototype) {
    let object = this;
    do {
        if (object === prototype) return true;
        let object = Object.getPrototypeOf(object);
    } while(object);
    return false;
}
```

## 你不知道的JavaScript部分

#### 属性屏蔽
三种情况（`myObject.foo="bar"`）：
- 如果原型链上层存在名为foo的普通数据访问属性，并且没有标记为已读，如果直接在myObject中添加一个foo的新属性，会产生属性屏蔽；
- 如果标记为已读了，这条赋值语句就会被忽略，严格模式下会报错；
- 如果原型链上层存在foo并且它是一个setter，那么就会去调用这个setter，而不会将foo作为属性添加到myObject。

如果希望后两种情况也产生属性屏蔽，就不能直接使用赋值语句，而是要使用`Object.defineProperty()`来添加该属性。

**小心隐式屏蔽**

```
var anotherObject = {a:2};
var myObject = Object.create(anotherObject);

myObject.a++;//隐式屏蔽！ -> myObject.a = myObject.a + 1;
myObject.a;//3
anotherObject.a;//2

myObject.hasOwnProperty("a");//true
```

#### Object.create()的polyfill

```
if(!Object.create) {
    Object.create = function(o) {
        function F(){}
        F.prototype = o;
        return new F();
    }; 
}
```

#### 行为委托
JavaScript中的原型链就是对象之间的关联关系。

面向对象（基于构造函数的原型继承）和对象关联（基于原型的）的比较：

```
//面向对象
function Foo(who){
    this.me = who;
}
Foo.prototype.identify = function() {
    return "I am " + this.me;
};

function Bar(who) {
    Foo.call(this, who);
}
Bar.prototype = Object.create(Foo.prototype);

Bar.prototype.speak = function() {
    alert("hello," + this.identify() + ".");
}

let b1 = new Bar("b1");
let b2 = new Bar("b2");
```

```
//对象关联
Foo = {
    init: function(){
        this.me = who;
    }
    identify: function() {
        return "I am " + this.me;
    }
}

Bar = Object.create(Foo);

Bar.speak = function() {
    alert("hello," + this.identify() + ".");
};

var b1 = Object.create(Bar);
b1.init("b1");
var b2 = Object.create(Bar);
b2.init("b2");
```

#### 委托模式（对象关联）举例

```
//登录验证
const LoginController = {
    errors: [],
    getUser() {
        return document.getElementById("login_username").value;
    },
    getPassword() {
        return document.getElementById("login_password").value;
    },
    validateEntry() {
        user = user || this.getUser();
        pw = pw || this.getPassword();

        if(!(user && pw)){
            return this.failure("Please enter a username & password!");
        } else if (user.length < 5) {
            return this.falser("Password must be 5+ chaacters!");
        }
        return true;
    },
    showDialog(){
        //message
    },
    failure(){
        this.errors.push(err);
        this.showDialog("Error", "Login invalid: " + err);
    }
}

const AuthController = {
    errors:[],
    checkAuth() {
        const user = this.getUser();
        const pw = this.getPassword();

        if (this.validateEntry(user,pw)) {
            this.server("/check-auth", {
                user,
                pw
                }).then(this.accepted.bind(this))
                  .fail(this.rejected.bind(this));
        }
    },
    server(url,data) {
        return $.ajax({
            url,
            data
            });
    },
    accepted() {
        this.showDialog("success", "Authenticated!");
    },
    rejected() {
        this.failure("Auth FailedL: " + err);
    }
}

Object.setPrototypeOf(AuthController, LoginController);
```

## ES6中新增的内容

#### 以更好的语法糖实现对类的模拟

```
class Button extends Widget {
    constructor(width,height,label) {
        super(width,height);
    }
    render($where) {
        super($where);
    }
}
```

#### 对对象的扩展

- `Object.is()`

用于比较两个值是否完全相等，实际上还是"==="更加常用，但这个可以解决一些极端情况下"==="令人费解的返回值的问题。

```
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

- `Object.assign()`

用于对象的合并，如果有多个同名属性，后面的参数里的属性值会覆盖前面的，如果传入的参数不是对象，他会被转为对象，但是"undefined"和"null"在参数首会报错，（出现在非参数首）字符串会以数组形式拷贝入对象，其他基本类型不会生效。

只会去拷贝原对象自身的属性，不会去拷贝继承的属性，也不拷贝不可枚举的属性（"enumerable":false,所有class的原型方法都是不可枚举的）。

它实现的是浅复制，如果需要deep copy则需要其他库的支持（object-assign），或使用更好的immutable。

实现它的一个Polyfill

```
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // We must check against these specific cases.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
```

- `Object.keys()`

获取对象的非继承且可枚举的键名，应该取代for-in

```
var obj = { foo: "bar", baz: 42 };
Object.keys(obj).forEach((value) => {
    console.log(value,obj[value]);
});
```

## 参考
1. 高程，YDKJS
2. [为什么原型继承很重要](http://top.css88.com/archives/717)

