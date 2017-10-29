Js中sort()方法用于对数组的元素进行排序,可以将一个排序函数作为参数,如果没有参数,默认
的函数是将数组里的元素按照Ascll码的大小按照从小到大进行排序(其实也就是把数组的元素转换成字符串直接进行字符串的比较的.)

所以默认的排序函数是不能用于真正的数字的排序的,不过可以自己编写排序规则作为参数传入,最常见的从小到大排序可以写成  


	function base(a,b){
	return a-b;}

对去其他很多编程语言,往往需要循环和递归来实现排序,但js竟然可以直接写一个比较函数就能对一个数组进行排序,
于是开始好奇,作为一门语言的内置的排序,它使用的是什么算法呢?  


考虑大多数的排序算法实质就是比较和交换,似乎可以理解这样编写比较函数,似乎是给js内置的排序算法提供了一个
比较交换的规则.内部以这个函数作为一个参数,接受其返回值,作为比较交换的规则的一部分.  


看到已经有人写了,jsV8中对于较短的数组使用插入排序,而对于较长的数组则使用快速排序.  

所以js中的sort语句  

	arr1.sort(base);
可以大致理解为是执行下面这样的代码:  


		function QuickSort(arr, func) {
			if (!arr || !arr.length) return [];
			if (arr.length === 1) return arr;
			var pivot = arr[0];
			var smallSet = [];
			var bigSet = [];
			for (var i = 1; i < arr.length; i++) {
				if (func(arr[i], pivot) < 0) {
					smallSet.push(arr[i]);
				} else {
					bigSet.push(arr[i]);
				}
			}
			return QuickSort(smallSet, func).concat([pivot]).concat(QuickSort(bigSet, func));
		}
		
		var arr1=[12,34,2,55,23,14,1,66,25]
		function base(a,b){
		return a-b;}
		arr1 = QuickSort(arr1,base)//使用sort会改变原数组.

具体v8是如何实现并且优化的可以看这里  
[深入了解javascript的sort方法](http://www.zhouhua.info/2015/06/18/quicksort/)