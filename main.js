const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll('.grid div'));
const score = document.getElementById("score");
const startBtn = document.getElementById("start-button");
const btnImg = document.getElementById("btnImg");
let count = 0;
const width = 10;

// arrow buttons
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const downBtn = document.getElementById("down");
const rotateBtn = document.getElementById("rotate");

// colour
const colour = [
    '#FF3353',
    '#A03EFF',
    '#33FFD1',
    '#FFE833',
    '#15e915'
]


// // rought code
// for(i=0;i<200;i++){
//     squares[i].textContent=count
//     count++
// }

// shapes
const lshape = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zshape = [
    [width+1, width+2, width*2 , width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2 , width*2+1],
    [0, width, width+1, width*2+1],
]

const tshape = [
    [1, width,width+1,width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2,width*2+1],
    [1, width, width+1, width*2+1]
]

const oshape = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const ishape = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
]

const theShapes = [lshape, zshape, oshape, tshape, ishape]

let currentPosition = 4;
let currentRotation = 0;

// randomly selecting shapes
let random = Math.floor(Math.random()*theShapes.length)// give no. between 0-4
let currentShape = theShapes[random][currentRotation]

// draw the shapes
function draw(){

    currentShape.forEach((index)=>{
        squares[currentPosition + index].style.background = colour[random]
    })
}
 draw()

// erase the shape
function erase(){
    currentShape.forEach((index)=>{
        squares[currentPosition + index].style.background = ''
    })
}

// movedown
function moveDown(){
    erase()
    currentPosition += width
    draw()
    stop()
}

var timer = setInterval(moveDown, 1000)

// stop the shapes
function stop(){
    if(currentShape.some(index => squares[currentPosition + index + width].classList.contains('freeze'))) {
        currentShape.forEach(index => squares[currentPosition + index].classList.add('freeze'))

        // start a new shape falling
        random = Math.floor(Math.random()*theShapes.length)
        currentRotation = 0
        currentShape = theShapes[random][currentRotation]
        currentPosition = 4

        draw()
        gameOver()
        addScore()
        
    }
}

// control the game
function control(e){
    if(e.keyCode === 37){
        moveLeft()
    }
    else if(e.keyCode === 39){
        moveRight()
    }
    else if(e.keyCode === 40){
        moveDown()
    }
    else if(e.keyCode === 32){
        rotate()
    }
}

window.addEventListener("keydown", control);

// Control shapes in phone
leftBtn.addEventListener("click", moveLeft);
rightBtn.addEventListener("click", moveRight);
downBtn.addEventListener("click", moveDown)
rotateBtn.addEventListener("click", rotate)

// moveleft funtion
function moveLeft(){
    erase()

    let LeftBlockage = currentShape.some(index => (currentPosition + index) % width === 0)
    let Blockage = currentShape.some(index => squares[currentPosition + index - 1 ].classList.contains('freeze'));

    if(!LeftBlockage && !Blockage){
        currentPosition--;
    }
    

    draw()
}


// moveRight funtion
function moveRight(){
    erase()

    let RightBlockage = currentShape.some(index => (currentPosition + index) % width === width-1)
    let Blockage = currentShape.some(index => squares[currentPosition + index + 1 ].classList.contains('freeze'));

    if(!RightBlockage && !Blockage){
        currentPosition++;
    }
    

    draw()
}

// Rotate function
function rotate(){
    erase()
    currentRotation++ // 0-1-2-3-4
    if(currentRotation === 4){
        currentRotation = 0
    }
    currentShape = theShapes[random][currentRotation]

    draw()
}

// add functionality to pause button
function pause(){
    if(timer){
        clearInterval(timer)
        timer = null;
        btnImg.src = 'play.png'
    }
    else{
        draw()
        timer = setInterval(moveDown, 1000);
        btnImg.src = 'pause.png'
    }
}

startBtn.addEventListener("click" , pause)

// game over funtion
function gameOver(){
    if(currentShape.some(index => squares[currentPosition + index].classList.contains('freeze'))){
        score.innerHTML = "Game Over"
        clearInterval(timer)
    }
}

// add Score
function addScore(){
    for(let i=0;i<199; i += width){
        const row = [i ,i+1, i+2, i+3, i+4, i+5, i+6 ,i+7, i+8, i+9];
        console.log(row)

        if(row.every(index => squares[index].classList.contains("freeze"))){
            count +=10
            score.textContent = `score:${count}`
            row.forEach(index =>{
                squares[index].classList.remove("freeze");
                squares[index].style.background = '';
            })
            const squareRemoved = squares.splice(i,width)
            console.log(squareRemoved)
            squares = squareRemoved.concat(squares)
            squares.forEach(square => grid.appendChild(square))
        }
    }
}

