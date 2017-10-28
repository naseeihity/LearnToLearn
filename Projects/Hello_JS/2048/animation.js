function showNumAnimation(i,j,randNum){

    var numCell = $("#number-cell-"+i+"-"+j);

    numCell.css({
        "background-color":getNumBgc(randNum),
        "color":getNumColor(randNum)
    });

    numCell.text(randNum);

    numCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i),
        left: getPosLeft(j)},
        100);
}

function showMoveAnimation(fromx,fromy,tox,toy) {

    var numCell = $("#number-cell-"+fromx+"-"+fromy);

    numCell.animate({
        top:getPosTop(tox),
        left:getPosLeft(toy)
    },200);
}

function updateScore(score){
    $("#score").text(score);
}