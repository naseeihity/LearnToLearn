var piece=1;
var i=4;

//获取各个元素
function tab(ele){
    $parent = ele.parents("div.content");
    $uL1 = $parent.find("ul");
    $li1 = $parent.find("li");
    $picList=$parent.find("div.picList");

    imgWidth = $li1.width();
    divWidth = $picList.width();
    len=$uL1.find("li").length;
}
//整页左移
if(!$("ul").is(":animated")){
$("i#next").click(function(){
    tab($("i#next"));
    if(piece>=len-3){
        $uL1.animate({left:'0px'},"slow");
        piece=1;
    }else{
        $uL1.animate({left:'-='+divWidth},"slow");
        piece+=4;
    }
});
}

//整页右移
if(!$("ul").is(":animated")){
$("i#prev").click(function(){
    tab($("i#prev"));
    if(piece==1){
        $uL1.animate({left:'-='+imgWidth*(len-1)},"fast");
        piece =len;
    }else if(piece>4){
        $uL1.animate({left:'+='+divWidth},"slow");
        piece-=4;
    }else{
        $uL1.animate({left:'0px'},"fast");
        piece=1;
    }
});
}
//单幅图片左移
if(!$("ul").is(":animated")){
$("i#next0").click(function(){
    tab($("i#next0"));
    if(piece>=len-3){
        $uL1.animate({left:'0px'},"fast");
        piece =1;
    }else{
        $uL1.animate({left:'-='+imgWidth},"fast");
        piece++;
    }
});
}
//单幅图片右移
if(!$("ul").is(":animated")){
$("i#prev0").click(function(){
    tab($("i#prev0"));
    if(piece==1){
        $uL1.animate({left:'-='+imgWidth*(len-4)},"fast");
        piece =len-3;
    }else{
        $uL1.animate({left:'+='+imgWidth},"fast");
        piece--;
    }
});
}

