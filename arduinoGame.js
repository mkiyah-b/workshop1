
let port;
let connectBtn;


let newCact = 0;
let timer = 0;
let c = [];
let button;
let start = false;
let circStart = 280;
let circPeak = 180;
let circPos = 280;
let frog;
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
    this.x = 1200
    this.y = 245
    this.xV = 2.2
    this.grass = loadImage('grass.png');
  }
  
  display() {
    // fill(50,100,20)
    // rect(this.x, this.y, this.cactWidth, this.cactHeight)
    image(this.grass, this.x, this.y, this.cactWidth, this.cactHeight)
  }
  
  move() {
    this.x-=this.xV
  }
}


function setup() {
  createCanvas(1200, 500);
  // jumpIndex = 0;
  textAlign(CENTER)
  frog = loadImage('frog.png');
  
  port = createSerial();
  // in setup, we can open ports we have used previously
  // without user interaction

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }

  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)

  connectBtn = createButton("Connect to Arduino");
  connectBtn.mousePressed(connectBtnClick);
  connectBtn.position(1220,720)
  textFont('Times New Roman')
}

function draw() {
  // rectMode(CORNERS)
  let str = port.readUntil("\n");
  if (str.length > 0) {
    if (str == 0) {
      jump = true;
    }
    // print(str)
    if (!start && str == 1) {
      port.write(1)
      start = true;
      print("START")
    }
    else if (gameOver && str == 1) {
      reset()
    }
  }

  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
  } else {
    connectBtn.html("Disconnect");
  }


  background(220, 240, 255);
  // fill("gray")
  // circle(30, circPos, 30)
  image(frog, 15, circPos-15, 30, 30)
  fill('#427c18')
  rect(0,295, width, height)
  
  
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
  
  // if (mouseIsPressed && (width/2-75 < mouseX) && (width/2+75 > mouseX) && (height/2-35 < mouseY) && (height/2+35 > mouseY) && !start) {
  //     start = true;
  //     print("START!")
  //     }
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
  
  message()

  fill(0)
  textSize(18)
  text("Current Score", 590, 20)
  text("High Score", 710, 20)
  textSize(20)
  text(currentScore, 590, 40)
  text(highScore, 710, 40)
}  

function connectBtnClick() {
  if (!port.opened()) {
    port.open("Arduino", 9600);
  } else {
    port.close();
  }
}


function mousePressed() {
  // port.write(1)
}

function jumping() {
  port.write(4)
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
  if ((cactusX <= 43) && (circPos >= 226) && !gameOver && (cactusX > 20)) {
    // print(cactusX)
    // textSize(35)
    // fill(0)
    // text(2, 40, 40)
    port.write(2)
    print("GAME OVER")
    gameOver = true;
  }
}

function reset() {
  port.write(3)
  let cactusLength = c.length
  for (let h=0; h< cactusLength; h++){
    c.pop();
  }
  gameOver = false;
  newCact = 0;
  currentScore = 0;
  cactIndex = 0;
}

function message() {
  if (!start) {
    // rectMode(CENTER)
    filter(BLUR)
    fill(100,200,100)
    rect(width/2-125, height/2-90, 250,170)
    fill(0,0,0)
    textSize(45)
    text("START", width/2, height/2)
    fill(0,0,0)
    textSize(16)
    text("LEFT = start, RIGHT = jump", width/2, height/1.7)
  }
  else if (gameOver) {
    // rectMode(CENTER)
    
    filter(BLUR)
    fill(0,0,0)
    rect(width/2-145, height/2-90, 290,170)
    fill(255,255,255)
    textSize(45)
    text("GAME OVER", width/2, height/2)
    // button = createButton('TRY AGAIN', 'black')
    // button.position(width/2, height)
    // button.mousePressed(reset);
    
    if (currentScore > highScore) {
      highScore = currentScore;
    }
  }
}