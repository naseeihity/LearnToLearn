# JSON
## 语法
1. 简单值
```
{"Hello world!",5,"abc"}
```
2.对象
```
{
    "name": "Nicholas",
    "age": 29,
    "school": {
            "name": "Merrimack College",
            "location": "North Andover, MA"
            }
}
```
3. 数组
```
[
    {
        "title": "Professional JavaScript",
        "authors": [
            "Nicholas C. Zakas"
        ],
        edition: 3,
        year: 2011
    },
    {
        "title": "Professional JavaScript",
        "authors": [
            "Nicholas C. Zakas"
        ],
        edition: 2,
        year: 2009
    }
]
```

## 解析和序列化
- JSON.stringify(newObj)把Js对象序列化为JSON字符串
- JSON.parse(jsonText)把JSON字符串解析为原生Js值
- toJSON()方法，原生的Date对象就有这个方法，也可以自己给任意对象定义此方法

### 序列化选项
JSON.stringify(newObj,parameter1,parameter2)方法可以接收两个参数.  
- 第一个参数为一个过滤器，可以是数组，也可以是函数：
```
//数组
var jsonText = JSON.stringify(book, ["title", "edition"]);
//值返回key为title和edition的两个属性
//函数
var jsonText = JSON.stringify(book, function(key, value){
    switch(key){
        case "authors":
            return value.join(",")
        case "year":
            return 5000;
        case "edition":
            return undefined;
        default:
            return value;
    }
});
```
- 第二个参数表示字符串缩进。如果是数字，表示每个级别缩进的空格数；如果是字符串，表示被用作缩进的字符。缩进字符串长度无法超过10个字符。

#### 序列化对象的顺序
1. 如果存在toJSON()方法并且能够得到有效的值，则调用该方法，否则返回对象本身。
2. 如果提供了第二个参数过滤器，应供他。传入过滤器的值是第一步返回的值。
3. 对第二步每个值进行相应的序列化。
4. 如果提供了第三个参数，执行相应的格式化。

### 解析选项
JSON.parse()方法也接受一个函数作为参数，在每个键值对上调用，被称作还原函数(reviver)。

