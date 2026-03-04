let newCact = 0;
let timer = 0;
let c = [];
let button;
let start = false;
let circStart = 280;
let circPeak = 180;
let circPos = 280;
let jump = false;
let down = false;
let gameOver = false;
let touched = false;
let currentScore = 0, highScore = 0;
let cactIndex = 0;

class cactus {
  constructor(){
    this.cactHeight = 50
    this.cactWidth = 20
    this.x = 800
    this.y = 245
    this.xV = 2.2
  }
  
  display() {
    fill(50,100,20)
    rect(this.x, this.y, this.cactWidth, this.cactHeight)
  }
  
  move() {
    this.x-=this.xV
  }
}


function setup() {
  createCanvas(800, 600);
  // jumpIndex = 0;
  textAlign(CENTER)
  
}

function draw() {
  background(220);
  fill("gray")
  circle(30, circPos, 30)
  fill('gray')
  rect(0,295, width, 105)
  
  
  for (let i=0; i< c.length; i++){
    c[i].display();
    if (!gameOver){
      c[i].move();
    }
    hit(c[i].x)
    if (cactIndex == i && c[i].x < 20 && c.length != 0) {
      currentScore++
      print(currentScore)
      cactIndex++
      print(cactIndex)
    }
  }
  
  
  if (!start) {
    filter(BLUR)
    fill(100,200,100)
    rect(width/2-75, height/2-35, 150,70)
    fill(0,0,0)
    textSize(20)
    text("START", width/2, height/2)
  }
  
  if (mouseIsPressed && (width/2-75 < mouseX) && (width/2+75 > mouseX) && (height/2-35 < mouseY) && (height/2+35 > mouseY) && !start) {
      start = true;
      print("START!")
      }
  if (frameCount % (30) == 0) {
    timer++;
  }
  if ((timer == newCact || newCact == 0) && start && !gameOver) {
    c.push(new cactus());
    timer = 0;
    newCact = int(random(2,10))
    // print(newCact)
  }
  
  if (jump) {
    jumping();
  }
  
  if (gameOver) {
    filter(BLUR)
    fill(0,0,0)
    rect(width/2-75, height/2-35, 150,70)
    fill(255,255,255)
    textSize(20)
    text("GAME OVER", width/2, height/2)
    // fill(100)
    // rect(width/2-50, height/2+10, 100, 20)
    // fill(0)
    // textSize(12)
    // text("TRY AGAIN", width/2, height/2 + 25)
    button = createButton('TRY AGAIN', 'black')
    button.position(0, 0)
    button.mousePressed(reset);
    
    if (currentScore > highScore) {
      highScore = currentScore;
    }
  }
  
  fill(0)
  textSize(10)
  text("Current Score", 570, 20)
  text("High Score", 650, 20)
  textSize(20)
  text(currentScore, 570, 40)
  text(highScore, 650, 40)
}  


function mousePressed() {
  jump = true;
}

function jumping() {
  if ((circPos > circPeak) && !down) {
    circPos = circPos - 5;
  }
  if (circPos == circPeak) {
    down = true;
  }
  if ((circPos < circStart) && down) {
    circPos = circPos + 4;
  }
  if ((circPos == circStart)) {
    jump = false;
    down = false;
  }
}

function hit(cactusX) {
  // print(cactusX)
  if ((cactusX <= 44) && (circPos >= 226) && !gameOver && (cactusX > 20)) {
    // print(cactusX)
    print("GAME OVER")
    gameOver = true;
  }
}

function reset() {
  let cactusLength = c.length
  for (let h=0; h< cactusLength; h++){
    c.pop();
  }
  gameOver = false;
  newCact = 0;
  currentScore = 0;
  cactIndex = 0;
}
