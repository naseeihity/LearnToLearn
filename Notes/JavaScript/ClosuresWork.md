# 闭包
**指有权访问另一个函数作用域中的变量的函数。**  
闭包就是携带状态的函数，并且它的状态可以完全对外隐藏起来。
##1. 闭包只能取得包含函数中任何变量的最后一个值。  

		function createFunctions(){
			var result = new Array();
			for (var i=0; i < 10; i++){
				result[i] = function(){
					return i;
				};
			}
			return result;//每个函数都返回10
		}  
可以改为:  

		function createFunctions(){
			var result = new Array();
			for (var i=0; i < 10; i++){
				result[i] = (function(num){
					return function(){
						return num;
					};
				})(i);//创建了一个匿名函数并立即执行,将i的值传给num
			}
			return result;//返回0~9
		}  
