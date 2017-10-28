var AppShow = (function(){
    //js新的选择器，可以向jq一样选择一些元素了
    var wrapper = document.querySelector('#wrapper'),
        device = wrapper.querySelector('.device'),
        trigger = device.querySelectorAll('a')[0],
        screens = wrapper.querySelector('.grid_content').querySelectorAll('a'),
        screenImg = device.querySelectorAll('img'),
        screenTitle = device.querySelectorAll('.title'),
        body = document.querySelector('body');

    //初始化
    function init(){
        //显示缩略图
        trigger.onclick =showGrid;
        //显示大图
        for(var i=0;i<screens.length;i++){
            screens[i].onclick = function() {
            showScreen(this);
            return false;
        };
        }

    }
    //缩略图显示函数
    function showGrid(ev) {
        var oEvent = ev;
        wrapper.classList.add('gridview');
        //取消事件冒泡
        oEvent.cancelBubble = true;

        body.onclick=function(){
            showScreen();
        }
        return false;
    }

    function showScreen(screen){
        wrapper.classList.remove('gridview');
        if(screen){
            var myAttr = screen.getElementsByTagName('img')[0].getAttribute('src');
            screenImg[0].setAttribute('src', myAttr);
        }
    }

    return{init:init};

})();