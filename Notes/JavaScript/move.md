# Move
1. 定时器与延时 

		setInterval(func,1000);开启一个定时器(每1s执行一次函数)
		clearInterval(timer); 关闭定时器
		setTimeout(func,1000);延迟1s后执行
		clearTimeout(setTimeout(func,1000));取消延时
2. 获取非行间样式

		window.onload=function (){
			var oDiv=document.getElementById("div1");
				if(oDiv.currentStyle) //IE下为真，FF下为假
			{
			alert(oDiv.currentStyle.width)
			}
			else
			{
			alert(oDiv.getComputedStyle(oDiv, false(任意值)).width);    
			}
		}