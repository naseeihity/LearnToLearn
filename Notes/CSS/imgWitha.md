今天在试着仿做一个Gallery页面的时候,发现在下面的结构下,div,a,img的大小并不相等:  
		
               <div>
        	       <a href="#"><img src="1.jpg" alt="demo"></a>
   		</div>

css代码如下:  
		
		html {
          box-sizing: border-box;
        }
        *, *:before, *:after {
          box-sizing: inherit;
          font-size:14px;
        }/*固定盒子的宽度为设置的宽度*/

        *{
            margin: 0 auto;
        }

        div{
            position: absolute;
            left: 30px;
            top:30px;
            margin-top: 20px;
            width: 270px;
            padding: 10px;
        }
		
预想的结果应该是div的宽度为270px,a,img为250(同理高度也应相差padding的20).然而得到的结果却大不一样.  
                
                `<a>`:250*19;  
                `<img>`:250*167
                `div` 250*191.5
                
这是为什么呢?  
首先,这里的19px是对应14px字体大小的内容区域高度(对于simsun(宋体)这两个数应该是相等的).   

其次,a和img都是内联元素(inline),首先,想将img放在a里面,需要通过设置a标签为块级框  

                a{
                  display:block;
                //   或者
                  display:inline-block;
                  }
                  
设置完成后,a的高度也变成了167,然而div的宽度还是191.5,除了padding的20px,还多出了4.5px,这又是哪里来的呢?  
这就涉及到内联元素的一个很重要的概念,[baseline](http://www.zhangxinxu.com/wordpress/2009/11/css%E8%A1%8C%E9%AB%98line-height%E7%9A%84%E4%B8%80%E4%BA%9B%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E5%8F%8A%E5%BA%94%E7%94%A8/),
实际上默认的inline里的图片(与文字的)对齐方式是以baseline为基准的,而img下方多出的4.5px的空白就是从baseline到bottom的距离.  

### 关于行高
行高定义:两个baseline之间的距离.  

内容区域高度+行间距=行高

### 那么,如何才能去掉img下的那一块空白呢?基本有以下几种方法:

1. 对于可能需要图文混排,需要设置img:

                img{
                    vertical-align: bottom;(或middle)
                }
2. 对于只是图片需要去掉那段空白,可以对a标签  

                a{
                  line-height = 0;
                //   或者,在没有设置line-height的情况下设置
                  font-size:0;
                 }
3. 简单粗暴的方法,将img也设置为block,这样就全都不是行间元素了,也就不会有相应的问题了.  

这里有几点问题需要注意:  

1. a标签下嵌套img标签,Ie下会有边框,要去掉则需要

                img{
                    border = 0;
                   }
                   
2. 实际上,对于只包含文字的块级元素,其高度是靠行高撑起来的,也就是通过设置行高可以来改变div的高度,但需要注意,如果不设置,或者设为normal
浏览器会根据font-size来计算出相应的行高(不同浏览器的系数可能不同),所以对于这个问题也就可以通过在没有设置行高的情况下,设置font-size=0
来达到目的(实际上还是改变了行高).  
这个问题中,我所使用的火狐浏览器,对于font-size=14px的情况下,normal的行高为20px.

3. 注意到全局设置了`box-sizing: border-box`

                html {
                      box-sizing: border-box;
                      }
                *, *:before, *:after {
                box-sizing: inherit;
                } 
    作用是,可以固定div的宽度,也就是通过改变div的padding和border的大小不会改变div的宽度了,使得div更像一个盒子.
    而div的内部的元素(此例中为img设置width-max后)的宽度会自动适应.  
    这里这样写是因为,选择器 * 无法覆盖到伪元素，所以需要给 :before 和 :after 分别设置。而通过继承的方式应用到所有元素，需要时可以方便的设置某个元素及其后代元素的 box-sizing 回 content-box。
    


## demo
[a标签里的img](https://jsfiddle.net/1j0msq4d/)