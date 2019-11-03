var d = document;

function drawSquare(top, left, color='black', klass='', width='10px', height='10px'){
    var x = d.createElement('d');
    x.style.position='absolute';
    x.style.width='10px';
    x.style.height='10px';
    x.style.backgroundColor=color;
    x.style.top=top+'px';
    x.style.left=left+'px';
    x.className = klass;
    d.body.appendChild(x);
}

function times(n, func){
    var result = null;
    for(let i=0;i<n;i++){
        result = func();
    }
    return result;
}

var createRow = (x)=>{
    let row = [];
    row.push('B');
    times(10, ()=>row.push(x));
    row.push('B');
    return row
};
function resetField(field=[]){
    times(2, ()=>field.push(createRow('N')));
    let firstRow = [];
    times(3, ()=>firstRow.push('B'));
    times(6, ()=>firstRow.push('N'));
    times(3, ()=>firstRow.push('B'));
    field.push(firstRow);
    times(20, ()=>field.push(createRow('N')));
    field.push(createRow('B'));
}

var colorMap = {
    I : 'rgb(115, 251, 253)',
    O : 'rgb(255,253,84)',
    S : 'rgb(114,249,76)',
    Z : 'rgb(235,50,35)',
    J : 'rgb(0,40,245)',
    L : 'rgb(238,111,67)',
    T : 'rgb(234,65,247)',
    B : 'rgb(0,0,0)',
    N : 'rgb(255,255,255)'
};

function drawField(field){
    let y=0;
    field.forEach((row)=>{
        let x=0;
        row.forEach((field)=>{
            // drawSquare(y*fieldUnit, x*fieldUnit, (field == 1 ? 'black' : 'white'));
            drawSquare(y*fieldUnit, x*fieldUnit, colorMap[field]);
            x++;
        });
        y++;
    });
}

function copyMinoToField(mino, position){
    var size = mino.field[0].length;
    var offset = Math.floor(size /2);
    for(let y=0;y<size;y++){
        for(let x=0;x<size;x++){
            if(mino.field[y][x]==1){
                var fx = position[0] - offset + x;
                var fy = position[1] - offset + 1 + y;
                field[fy][fx]=mino.name;
            }
        }
    }
}


function checkMinoPositionInField(mino, position){
    var size = mino.field[0].length;
    var offset = Math.floor(size /2);
    for(let y=0;y<size;y++){
        for(let x=0;x<size;x++){
            if(mino.field[y][x]==1){
                var fx = position[0] - offset + x;
                var fy = position[1] - offset + 1 + y;
                if(field[fy][fx]!=='N'){
                    return false;
                }
            }
        }
    }
    return true;
}

function drawMino(position, mino){
    var size = mino.field[0].length;
    var offset = Math.floor(size /2);
    for(let y=0;y<size;y++){
        for(let x=0;x<size;x++){
            if(mino.field[y][x]===1){
                var left = 10 * (position[0] - offset + x);
                var top = 10 * (position[1] - offset + 1 + y);
                drawSquare(top, left, colorMap[mino.name], 'mino')
            }
        }
    }
    
}

function rotate(mino, n=1) {
    var newField = mino.field;
    times(n, ()=>{
        newField = rotate_(newField);
    });
    return newField;
}

function rotate_(field) {
    var rotated = [];
    var size = field.length;
    for (var y = 0; y < size; ++y) {
        rotated[y] = [];
        for (var x = 0; x < size; ++x) {
            rotated[y][x] = field[x][- y + (size-1)];
        }
    }
    return rotated;
}

function newMino() {
    minoPosition = [6, 1];
    return MINOS[Math.floor(Math.random() * MINOS.length)];
}

function replaceClass(oldClass, newClass){
    var minoElements = d.getElementsByClassName(oldClass);
    var ary=[];
    for(var i=0,l=minoElements.length;i<l;i++){
        ary.push(minoElements[i]);
    }
    ary.map((e)=>e.className=newClass);
    
}

function eraseMino(){
    var minoElements = d.getElementsByClassName('mino');
    var ary=[];
    for(var i=0,l=minoElements.length;i<l;i++){
        ary.push(minoElements[i]);
    }
    ary.map((e)=>e.parentElement.removeChild(e));
}



function horizontalMoveOperate(keyCode){
    // console.log(keyCode);
    let newMinoPosition = [];
    newMinoPosition[0] = minoPosition[0];
    newMinoPosition[1] = minoPosition[1];

    switch (keyCode){
    case 37:
        newMinoPosition[0] -= 1;
        break;
    case 39:
        newMinoPosition[0] += 1;
        break;
    }
    if(checkMinoPositionInField(currentMino, newMinoPosition)){
        minoPosition = newMinoPosition;
        redrawMino();
    }

}

function rotateOperate(keyCode){
    // console.log(keyCode);
    var n = (keyCode === 90 ? 1 : 3);
    var newField = rotate(currentMino, n);
    var newMino = {color: colorMap[currentMino.name], field:newField};


    if(checkMinoPositionInField(newMino, minoPosition)){
        currentMino.field = newField;
        redrawMino();
        landing = false;
    }

    redrawMino();
}

function operate(keyCode){
    if(HORIZONTAL_MOVE_KEYS.indexOf(keyCode) >= 0){
        horizontalMoveOperate(keyCode);
    } else if (ROTATE_KEYS.indexOf(keyCode) >= 0) {
        rotateOperate(keyCode);
    }else if(keyCode == DOWN_KEY){
        moveDown();
    }
}

function redrawMino(){
    eraseMino();
    drawMino(minoPosition, currentMino);
}

function checkAndRemoveLines(){
    var linesToBeRemoved = {};
    for(let y=0,yl=field.length; y<yl; y++) {
        var blockNum = field[y].map((e)=> (e != 'N') && (e != 'B') ? 1 : 0).reduce((a,b)=>a+b);
        if (blockNum == field[y].length - 2 ){
            linesToBeRemoved[y] = true;
        }
    }
    field[2][1] = 'N';
    field[2][2] = 'N';
    field[2][9] = 'N';
    field[2][10] = 'N';
    newField = field.filter((_,i)=>!(i in linesToBeRemoved));
    var diff = field.length - newField.length;
    times(diff, ()=>newField.unshift(createRow('N')));
    newField[2][1] = 'B';
    newField[2][2] = 'B';
    newField[2][9] = 'B';
    newField[2][10] = 'B';
    field = newField;
}

function moveDown(){
    var newPos = [];
    newPos[0] = minoPosition[0];
    newPos[1] = minoPosition[1];
    if(!landing){
        newPos[1] += 1;
        if(checkMinoPositionInField(currentMino, newPos)){
            minoPosition = newPos;
            redrawMino();
        } else {
            landing = true;
        }
    } else { // in landing
        landing = false;
        // game over judge
        if(minoPosition[1] == 1){
            gameOver();
            return;
        }

        copyMinoToField(currentMino, minoPosition);
        // replaceClass('mino', 'stay_mino');
        eraseMino();

        checkAndRemoveLines();

        drawField(field);
        currentMino = newMino();
        // game over judge
        if (!checkMinoPositionInField(currentMino, minoPosition)) {
            gameOver();
            return;
        }
    }
}

function gameOver(){
    console.log('game over');
    clearInterval(keepDown);
    field = [];
    resetField(field);
    newMino();
    drawField(field);
    setTimeout(resetKeepDown, 3000);

}

var MINOS = [
    {
        name: 'I',
        color: colorMap.I,
        field:[
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0], // I
            [0, 0, 0, 0]
    ]},
    {
        name: 'O',
        color: colorMap.O,
        field:[
            // [0, 0, 0, 0],
            // [0, 1, 1, 0],
            // [0, 1, 1, 0], // O
            // [0, 0, 0, 0]
            [1, 1],
            [1, 1] // O
    ]},
    {
        name: 'S',
        color: colorMap.S,
        field:[
            // [0, 0, 0, 0],
            // [0, 1, 1, 0],
            // [1, 1, 0, 0], // S
            // [0, 0, 0, 0]
            [0, 1, 1],
            [1, 1, 0], // S
            [0, 0, 0]
        ]},
    {
        name: 'Z',
        color: colorMap.Z,
        field:[
            // [0, 0, 0, 0],
            // [1, 1, 0, 0],
            // [0, 1, 1, 0], // Z
            // [0, 0, 0, 0]
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]},
    {
        name: 'J',
        color: colorMap.J,
        field:[
            // [0, 0, 0, 0],
            // [1, 0, 0, 0],
            // [1, 1, 1, 0], // J
            // [0, 0, 0, 0]
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]},
    {
        name: 'L',
        color: colorMap.L,
        field:[
            // [0, 0, 0, 0],
            // [0, 0, 1, 0],
            // [1, 1, 1, 0], // L
            // [0, 0, 0, 0]
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ]},
    {
        name: 'T',
        color: colorMap.T,
        field:[
            // [0, 0, 0, 0],
            // [0, 1, 0, 0],
            // [1, 1, 1, 0], // T
            // [0, 0, 0, 0]
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]}
];

var keyQ=[];
document.body.addEventListener('keydown', function(e){
    // console.log(e.keyCode);
    keyQ.push(e.keyCode);
})


var field=[];
var fieldUnit=10;
var minoPosition = [];

resetField(field);
drawField(field);
var currentMino = newMino();
drawMino(minoPosition, currentMino);


var HORIZONTAL_MOVE_KEYS = [37, 39];
var ROTATE_KEYS = [88, 90];
var DOWN_KEY = 40;

var keyProcess = setInterval(function(){
    var keyCode = keyQ.shift();
    operate(keyCode);
    
},1);



var landing=false;
var keepDown = null;

function resetKeepDown(){
    keepDown = setInterval(function(){
        moveDown();
    }, 1000)
}
resetKeepDown();

