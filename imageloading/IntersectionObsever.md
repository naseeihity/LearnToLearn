(IntersectionObserver)[https://wicg.github.io/IntersectionObserver/#queue-intersection-observer-task]Support Chrome51+

判断元素是否进入视窗（viewport）内

```
const element = document.querySelector('.Observed');  // 拿到要被监视的元素

let io = new IntersectionObserver((entries) => {
	//do something when the element come into the viewport	
},option) // 实例化一个IntersectionObserver对象

io.observe(element); //监听多个element的位置
io.observe(element1); 
io.observe(element1); 

//callback中entries参数是一个数组，每一项为一个IntersectionObserverEntry对象，可以获得和元素位置相关的各种属性
```
[IntersectionObserverEntry]
    time: 3893.92
  rootBounds: ClientRect // view的信息
      bottom: 920
      height: 1024
      left: 0
      right: 1024
      top: 0
      width: 920
  boundingClientRect: ClientRect // 元素的位置信息
    // ...
  intersectionRect: ClientRect // 元素的进入view的信息
    // ...
    intersectionRatio: 0.54 // 进入了54%
  target: div#observee
    // ...
```
// option中
```
{
  root: null, //设置viewport的元素，默认为浏览器
  rootMargin: // 设置提前多少出发callback（格式和margin相同）
  threshold: // 设置进入多少出发一次callback（为数组，可设置0-1直接的数)
}
