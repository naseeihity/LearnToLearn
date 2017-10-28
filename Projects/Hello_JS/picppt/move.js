//一个多物体运动的运动框架
// obj是需要运动的元素,mlist是元素运动的属性(left,opacit等)为json类型,可传入任意数量
// fnEnd问链式运动中的下一个运动函数
function startmove (obj,mlist,fnEnd) {
            clearInterval(obj.timer);
            //注意对于多物体运动,任何东西尤其是定时器绝对不能公用
            obj.timer = setInterval(function(){
                var flag = 1;//用于检测是否全部运动运动完成

                for(name in mlist){
                    var tValue = 0;
                    if (name === 'opacity'){
                        tValue = Math.round(parseFloat((window.getComputedStyle(obj,null))[name])*100);
                    }//透明度为float类型并且对其进行取整,使用getComputedStyle获取对应css属性的值
                    else{
                         tValue = parseInt((window.getComputedStyle(obj,null))[name]);
                    }

                    var speed = (mlist[name]-tValue)/8;//使得运动速度可正可负
                        speed = speed>0 ? Math.ceil(speed): Math.floor(speed);
                    if (tValue != mlist[name]){
                        flag = 0;//有运动没有完成则将其赋值为假
                    }
                        if (name === 'opacity'){
                            obj.style.opacity = (tValue + speed)/100;
                        }
                        else{
                            obj.style[name] = tValue + speed +'px';
                        }
                }
                if (flag){
                    clearInterval(obj.timer);//如果全部运动运动完成则关闭定时器
                    if(fnEnd)fnEnd();//如果第一步的运动结束后还有传入的下一步运动函数则执行它
                }
            }, 30);
        }