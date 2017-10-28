//包装成tab函数
function tab(options){
    //分别代表父级dom,操作的元素,控制的元素
    var $element,$triggers,$contents;
    //extend方法常用于包装函数,可以将传入的元素合并(相同属性覆盖,不同则添加)
    options = $.extend({
                onSwitch: function(index, count){

                },//触发tab时的回调函数
                activeIndex:1,//默认选中的索引
                selectTrig:'selected',//传入选中的li的样式
                element: null,
                triggers: '.triggers',
                contents: '.contents',
                triggerType:'click' //可传入触发类型
     },options || {});

    // 使用jquery元素,为了能够使用jquery方法
    $element = $(options.element);

    if(!$element.length){
        return null;
    }
    //获取父级dom下面相应的子元素
    $triggers = $element.find(options.triggers);
    $contents = $element.find(options.contents);

    //使用on来实现hover,需要通过mouseenter
     if(options.triggerType === 'hover'){
        options.triggerType = 'mouseenter';
    } else {
        options.triggerType = 'click';
    }

    //给操作的元素添加事件,并将事件绑定在命名空间tab上
    $triggers.on(options.triggerType+'.tab',function(){
         var index = $triggers.index(this);
         $(this).addClass(options.selectTrig).siblings().removeClass(options.selectTrig);
         $contents.eq($triggers.index(this)).show().siblings().hide();
        // 触发回调函数,将this设定为content
         options.onSwitch.call($contents.get(index), index, $triggers.length);
    });

    //.trigger():根据绑定到匹配元素的给定的事件类型执行所有的处理程序和行为。
    //通过传入的触发源来显示内容
    //函数的调用要写到声明后面
    $triggers.eq(options.activeIndex).trigger(options.triggerType+'.tab');
};