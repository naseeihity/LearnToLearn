
var board = new Array();//存储数字
var hasMixed =  new Array();//标记已经合并过的块
var score = 0;//总分
//触摸
var startx=0;
var starty=0;
var endx=0;
var endy=0;


$(document).ready(function() {
    prepareForMobile();
    newgame();
});

function prepareForMobile(){
    if(documentWidth>667){
        gridContainerWith = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $("#grid-container").css({
        "width":gridContainerWith-2*cellSpace,
        "height":gridContainerWith-2*cellSpace,
        "padding":cellSpace,
        "border-radius":0.02*gridContainerWith
    });

    $(".grid-cell").css({
        "width":cellSideLength,
        "height":cellSideLength,
        "border-radius":0.05*cellSideLength
    });
}

function newgame() {
    //初始化
    init();
    //随机在两个盒子生成数字
    createOneNum();
    createOneNum();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i));
            gridCell.css('left',getPosLeft(j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i]=new Array();
        hasMixed[i]= new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasMixed[i][j]=0;//初始化为每一个位置为为融合状态
        }
    }

    updateBoardView();

    score = 0;

    updateScore(score);
}

function updateBoardView(){
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumCell= $("#number-cell-"+i+"-"+j);

            if(board[i][j]==0){
                theNumCell.css({
                    'width':'0px',
                    'height':'0px',
                    'top':getPosTop(i)+cellSideLength/2,
                    'left':getPosLeft(j)+cellSideLength/2,
                    'font-size':0.6*cellSideLength+'px'
                });
            }
            else{
                theNumCell.css({
                    'width':cellSideLength,
                    'height':cellSideLength,
                    'top':getPosTop(i),
                    'left':getPosLeft(j),
                    'background-color':getNumBgc(board[i][j]),
                    'color':getNumColor(board[i][j]),
                    'font-size':getNumSize(board[i][j])
                });
                theNumCell.text(board[i][j]);
            }

            hasMixed[i][j]=0;
        }
    }
    $(".number-cell").css({
        'line-height':cellSideLength+'px',
        'border-radius':0.05*cellSideLength
    });
}

function createOneNum(){

    if(nospace(board)){
        return false;
    }else{
        //随机一个位置
        var randx = parseInt(Math.floor(Math.random()*4));
        var randy = parseInt(Math.floor(Math.random()*4));
        //确保生成的位置上没有数字
        var times=0;
        while(times<50){
            if (board[randx][randy]==0) {
                break;
            }else{
                randx = parseInt(Math.floor(Math.random()*4));
                randy = parseInt(Math.floor(Math.random()*4));
                times++;
            }
        }

        if(times == 50){
            for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if(board[i][j]==0){
                            randx = i;
                            randy = j;
                            break;
                        }
                }
            }
        }
        //随机一个数字
        if (score<1024){
            var randNum = Math.random()< 0.75 ? 2:4;
        }else{
            randNum = Math.random()< 0.25 ? 2:4;
        }


        //在随机的位置显示生成的数字
        board[randx][randy] = randNum;

        showNumAnimation(randx,randy,randNum);

        return true;
    }
}

$(document).keydown(function(event) {
    switch (event.keyCode){
        case 37:
        //left
            event.preventDefault();
            if(moveLeft()){
                setTimeout("createOneNum()",200);
                setTimeout("isgameover()",300);
            }
            break;
        case 38:
        //up
            event.preventDefault();
            if(moveUp()){
               setTimeout("createOneNum()",200);
               setTimeout("isgameover()",300);
            }
            break;
        case 39:
        //right
            event.preventDefault();
            if(moveRight()){
                setTimeout("createOneNum()",200);
                setTimeout("isgameover()",300);
            }
            break;
        case 40:
        //down
            event.preventDefault();
            if(moveDown()){
                setTimeout("createOneNum()",200);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;
    }
});

document.addEventListener('touchmove',function(event){

   event.preventDefault();
});

document.addEventListener('touchstart',function(event){

    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){

    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx-startx;
    var deltay = endy-starty;
    //防止误触发
    if (Math.abs(deltax)<0.1*documentWidth && Math.abs(deltay)<0.1*documentWidth) {
        return;
    }

    if(Math.abs(deltax) >= Math.abs(deltay)){
        if(deltax<0){
            if(moveLeft()){
                setTimeout("createOneNum()",200);
                setTimeout("isgameover()",300);
            }
        }
        else{
            if(moveRight()){
            setTimeout("createOneNum()",200);
            setTimeout("isgameover()",300);
            }
        }
    }else{
        if(deltay<0){
            if(moveUp()){
                setTimeout("createOneNum()",200);
                setTimeout("isgameover()",300);
            }
        }
        else{
            if(moveDown()){
            setTimeout("createOneNum()",200);
            setTimeout("isgameover()",300);
            }
        }
    }
});



function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }else{
        for (var i = 0; i < 4; i++) {
            for(var j=1;j<4;j++){
                if(board[i][j]!=0){

                    for(var k=0;k<j;k++){
                        if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                            //move
                            showMoveAnimation(i,j,i,k);
                            board[i][k]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasMixed[i][k]){
                            //move
                            showMoveAnimation(i,j,i,k);
                            //add
                            board[i][k]+=board[i][j];
                            board[i][j]=0;
                            //add score
                            score += board[i][k];
                            updateScore(score);

                            hasMixed[i][k]=1;
                            continue;
                        }

                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
        }
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }else{
        for (var i = 0; i < 4; i++) {
            for(var j=2;j>=0;j--){
                if(board[i][j]!=0){

                    for(var k=3;k>j;k--){
                        if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                            //move
                            showMoveAnimation(i,j,i,k);
                            board[i][k]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && !hasMixed[i][k]){
                            //move
                            showMoveAnimation(i,j,i,k);
                            //add
                            board[i][k]+=board[i][j];
                            board[i][j]=0;

                            score += board[i][k];
                            updateScore(score);

                            hasMixed[i][k]=1;
                            continue;
                        }

                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
        }
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }else{
        for (var j = 0; j < 4; j++) {
            for(var i=1;i<4;i++){
                if(board[i][j]!=0){

                    for(var k=0;k<i;k++){
                        if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
                            //move
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board) && !hasMixed[k][j]){
                            //move
                            showMoveAnimation(i,j,k,j);
                            //add
                            board[k][j]+=board[i][j];
                            board[i][j]=0;

                            score += board[k][j];
                            updateScore(score);

                            hasMixed[k][j]=1;
                            continue;
                        }

                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
        }
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }else{
        for (var j = 0; j < 4; j++) {
            for(var i=2;i>=0;i--){
                if(board[i][j]!=0){

                    for(var k=3;k>i;k--){
                        if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
                            //move
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board) && !hasMixed[k][j]){
                            //move
                            showMoveAnimation(i,j,k,j);
                            //add
                            board[k][j]+=board[i][j];
                            board[i][j]=0;

                            score += board[k][j];
                            updateScore(score);

                            hasMixed[k][j]=1;
                            continue;
                        }

                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
        }
}

function isgameover(){

    if(nospace(board) && nomove(board)){
        gameover();
    }

}
function gameover(){
    $("#overplay").fadeIn('fast', function() {
        $("#box").css("width",gridContainerWith*0.8);
        $("#finalScore").text(score);
        $("#box").animate({
            'top':documentHeight/3
        },300);

    });
     $('#boxclose').click(function(){
        $('#box').animate({'top':'-200px'},300,function(){
            $('#overplay').fadeOut('fast');
        });
    });
}