window.onload = function(){
    var oDiv = document.getElementById('playimages');
    var oBtnPrev = document.getElementsByClassName('prev')[0];
    var oBtnNext = document.getElementsByClassName('next')[0];
    var oMarkLeft = document.getElementsByClassName('mark_left')[0];
    var oMarkRight = document.getElementsByClassName('mark_right')[0];

    var oDivSmall = document.getElementsByClassName('small_pic')[0];
    var oUlSmall = oDivSmall.getElementsByTagName('ul')[0];
    var aLiSmall = oDivSmall.getElementsByTagName('li');

    var oUlBig = document.getElementsByClassName('big_pic');
    var aLiBig = document.getElementsByTagName('li');

    var nowZIndex = 2;
    var now =0 ;

    oUlSmall.style.width = aLiSmall.length*aLiSmall[0].offsetWidth+'px';//设置小图ul的宽度

    //左右按钮
    oBtnPrev.onmouseover=oMarkLeft.onmouseover = displayObtnL;
    oBtnPrev.onmouseout=oMarkLeft.onmouseout = hiddenObtnL;//btn层级高于mark为了使btn能点击,在移出mark移入btn时需保证出于显示状态

    function displayObtnL(){
        startmove(oBtnPrev,{opacity:100});
    }

    function hiddenObtnL(){
        startmove(oBtnPrev,{opacity:0});
    }

    oBtnNext.onmouseover=oMarkRight.onmouseover = displayObtnR;
    oBtnNext.onmouseout=oMarkRight.onmouseout = hiddenObtnR;

    function displayObtnR(){
        startmove(oBtnNext,{opacity:100});
    }

    function hiddenObtnR(){
        startmove(oBtnNext,{opacity:0});
    }

    //大图切换
    for (var i = 0; i < aLiSmall.length; i++) {
        aLiSmall[i].index = i;//获得大图和小图的对应关系
        aLiSmall[i].onclick = function(){
            if (this.index == now) return;//检测是否点击的为当前大图显示的图片
            now = this.index;//将当前图片赋值给now
            tab();
        }

        aLiSmall[i].onmouseover = function(){
            startmove(this,{opacity:100});
        }
        aLiSmall[i].onmouseout = function(){
            // 如果移出的是当前大图的小图则不改变透明度
            if (this.index != now){
                startmove(this,{opacity:60});
            }

        }
    };

    function tab(){
        aLiBig[now].style.zIndex=nowZIndex++;

        for (var i = 0; i < aLiSmall.length; i++) {
            startmove(aLiSmall[i],{opacity:60});
        }
        startmove(aLiSmall[now],{opacity:100});

        aLiBig[now].style.height=0;//先将图片高度设为零
        startmove(aLiBig[now],{height:320});//图片逐渐展开

        if(now==0){
            startmove(oUlSmall,{left:0});//如果是第一张图片将小图Ul的left设置到0
        }
        else if(now==aLiSmall.length-1){
            startmove(oUlSmall,{left: -(now-2)*aLiSmall[0].offsetWidth});//如果是最后一张图将Left设置到倒数第二张图的位置
        }
        else{
            startmove(oUlSmall,{left:-(now-1)*aLiSmall[0].offsetWidth});
        }

    }

    oBtnPrev.onclick = function(){
        now--;
        if(now == -1){
            now = aLiSmall.length -1;
        }//到达第一张图后回到最后一张图
        tab();
    }

    oBtnNext.onclick = function(){
        now++;
        if(now == aLiSmall.length){
            now = 0;
        }//到达最后一张图后回到第一张图
        tab();

    }
    //设置自动播放
    var timer=setInterval(oBtnNext.onclick, 2000);
    oDiv.onmouseover = function(){
        clearInterval(timer);//鼠标移入自动播放停止
    }
    oDiv.onmouseout = function(){
        timer=setInterval(oBtnNext.onclick, 2000);//鼠标移出继续
    }
}


