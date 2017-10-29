#数组去重
1. 基本方法

indexOf进行判断如果在数组中不存在某元素则返回值为-1。
~~~
        // 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
        function uniqArray(arr) {
            var newarr=[];
            for (var i=0;i<arr.length;i++){
                if(arr.indexOf(arr[i])===i) newarr.push(arr[i]);//和下面的原理相同，更喜欢这个方法
                //if (newarr.indexOf(arr[i]) == -1) newarr.push(arr[i]);
            }
            return newarr;
        }

        // 使用示例
        var a = [1, 3, 5, 7, 5, 3];
        var b = uniqArray(a);
        console.log(b); 
~~~

2. 哈希表法

将数组的各个项传入对象作为其KEY，然后通过判断对象的KEY是否存在，来去重。
~~~
function uniqArray(arr) {
    var newarr=[],hashObj={},len=arr.length;
    for (var i=0;i<len;i++){
        if(!hashObj[a[i]]){
            hashObj[a[i]] = true;
            newarr.push(a[i]);
        }
    }
    return newarr;
}
~~~

3. 排序后去重
~~~
function uniqArray(arr) {
    arr.sort();
    var newarr = [arr[0]];
    for (var i=1;i<arr.length;i++){
        if(arr[i]!=newarr[newarr.length-1]){
            newarr.push(arr[i]);
        }
    }
    return newarr;
}
~~~