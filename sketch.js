let bg;
let lantern;
let lanterns = [];
let sunshine;
let sunshines = [];
let gothel;
let score = 0;
let randomTime;
let randomTimes = [];
let slideImage;
let slideStartTime = -1;
let slideDuration = 3000; 
let slideX = -200; 
let slideSpeed = 5; 
let slideImageWidth = 200; 
let slideImageHeight; 
let timerValue = 0;
let slidingIn = false;
let slidingOut = false;
let gameOver = false;
let startTime;
const gameDuration = 30000; // 60 seconds in milliseconds
let gameStarted = false;
let startButton;
let bgMusic; 



function preload() {
  bg = loadImage('assets/tangled_castle.png');
  lantern = loadImage('assets/tangled_lantern.png');
  sunshine = loadImage('assets/tangled_sun.png');
  slideImage = loadImage('assets/tangled_gothel.png');
  tangledLogo = loadImage('assets/tangled_logo.png');
  bgMusic = loadSound('assets/145 I See The Light (Piano Version) - Tangled.mp3'); 
}

function setup() {
  
  let canvas = createCanvas(1325, 745);
  // canvas.position(0, 0);

  let container = createDiv();
  container.style('display', 'flex');
  container.style('justify-content', 'center');
  container.style('align-items', 'center');
  container.style('height', '100vh'); 
  container.style('width', '100vw');  
  container.style('position', 'absolute');
  container.style('top', '0');
  container.style('left', '0');

  canvas.parent(container); 

 // Create start button
 startButton = createButton("Let's Play");
 startButton.style('font-size', '30px'); 
 startButton.style('padding', '15px 30px');
 startButton.style('background-color', 'gold'); 
 startButton.style('color', 'black'); 
 startButton.style('border', '3px solid orange'); 
 startButton.style('border-radius', '20px'); 
 startButton.style('cursor', 'pointer');
 startButton.style('position', 'absolute');
 startButton.style('top', '75%'); 
 startButton.style('left', '50%');
 startButton.style('transform', 'translate(-50%, -50%)');
 startButton.style('font-family', "'Times New Roman', serif"); 
 startButton.style('font-weight', 'bold');
 
 startButton.mousePressed(startGame);

  // Calculate the height to maintain the aspect ratio
  let aspectRatio = slideImage.height / slideImage.width;
  slideImageHeight = slideImageWidth * aspectRatio;

  for (let i = 0; i < 100; i++) {
    lanterns[i] = new Lantern();
  }
  for (let i = 0; i < 10; i++) {
    sunshines[i] = new Sunshine();
  }

  // Generate up to 5 random times between 10 and 60 seconds
  let numTimes = floor(random(1, 6));
  for (let i = 0; i < numTimes; i++) {
    randomTimes.push(floor(random(10, 60))); // Generate times in seconds
  }

  console.log("Random Time: " + randomTimes);
  startTime = millis(); // Start the timer
}

function startGame() {
  gameStarted = true;
  startButton.hide(); // Hide the button

  if (!bgMusic.isPlaying()) { 
    bgMusic.loop(); // Loop the music continuously
  }
}


function draw() {
  textFont('Times New Roman');


  if (!gameStarted) {
    background(29, 24, 92); 
    push();
    imageMode(CENTER);
    image(tangledLogo, width / 2, height / 3, tangledLogo.width / 3, tangledLogo.height / 3); 
    pop();
    fill(255, 204, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text('Welcome! Hover over the lanterns to help Rapunzel see as many lanterns as she can before time runs out. To earn bonus points hover over magic flowers. Look out for Mother Gothel!', width / 2 - 300, height / 2 - 50, 620, 200);
    return; 
  }

  textAlign(LEFT, TOP); 
  textSize(24);
  fill(0);
  text('Score: 0', 20, 20);
  text('Time Left: 60s', 20, 50);

  timerValue = (millis() - startTime) / 1000;
  let elapsedTime = millis() - startTime;
  let timeLeft = max(0, floor((gameDuration - elapsedTime) / 1000));

  if (elapsedTime >= gameDuration) {
    gameOver = true;
  }

  if (!gameOver) {
    background(bg);

    for (let lantern of lanterns) {
      lantern.update();
      lantern.display();
    }
    for (let lantern of lanterns) {
      lantern.hide();
    }

    for (let i = 0; i < 10; i++) {
      sunshines[i].update();
      sunshines[i].display();
    }
    for (let i = 0; i < 10; i++) {
      sunshines[i].hide();
    }

    // Display score and timer
    fill('white');
    textSize(24);
    text(`Score: ${score}`, 10, 30);
    text(`Time Left: ${timeLeft}s`, 10, 60);

    showGothel();
  } else {
    // Game Over Screen
    background(29, 24, 92);
    fill(255, 204, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Great job! Rapunzel has seen the lights.", width / 2, height / 2 - 50);
    textSize(30);
    text(`Final Score: ${score}`, width / 2, height / 2);
    let refreshButton = createButton('Play Again');
    refreshButton.position(width / 2, height / 2 + 50);
    refreshButton.style('font-size', '30px'); 
    refreshButton.style('padding', '15px 30px');
    refreshButton.style('background-color', 'gold'); 
    refreshButton.style('color', 'black'); 
    refreshButton.style('border', '3px solid orange'); 
    refreshButton.style('border-radius', '20px'); 
    refreshButton.style('cursor', 'pointer');
    refreshButton.style('position', 'absolute');
    refreshButton.style('top', '75%'); 
    refreshButton.style('left', '50%');
    refreshButton.style('transform', 'translate(-50%, -50%)');
    refreshButton.style('font-family', "'Times New Roman', serif"); 
    refreshButton.style('font-weight', 'bold');
  
    refreshButton.mousePressed(() => window.location.reload());
  }
}

function mousePressed() {
  if (!gameOver) {
    for (let lantern of lanterns) {
      lantern.hide();
    }
    for (let sunshine of sunshines) {
      sunshine.hide();
    }
  }
}



class Lantern {
  constructor() {
    this.x = random(1200);
    this.y = random(700);
    this.theta = random(TWO_PI);
    this.vel = random(0.1, 1);
    this.hidden = false;
    this.size = 50;  // Lantern size
  }

  update() {
    if (this.hidden) return;
    
    // Change direction when lantern hits the edge
    if (this.x > width + this.size || this.x < -this.size || this.y > height + this.size || this.y < -this.size) {
      this.theta = PI + this.theta;  // Reverse direction when it hits edges
    }

    // Update position
    this.x += this.vel * cos(this.theta);
    this.y += this.vel * sin(this.theta);
  }

  display() {
    if (this.hidden) return;

    push();
    translate(this.x, this.y);
    rotate(this.theta);  // Rotate lantern based on direction
    image(lantern, -this.size / 2, -this.size / 2, this.size, this.size);  // Center the lantern on the position
    pop();
  }
  hide() {
    if (this.hidden) return;

    // Ensure mouse is within canvas bounds
    if (!this.isMouseInCanvas()) {
      return;
    }

    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 25) {  // Lantern hitbox radius
      this.hidden = true;
      score++;
      console.log(`Lantern hidden at (${this.x.toFixed(2)}, ${this.y.toFixed(2)})`);
      console.log(`Mouse at (${mouseX}, ${mouseY})`);
      console.log(`Score: ${score}`);
    }
  }

  isMouseInCanvas() {
    return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  }


}


class Sunshine {
  constructor() {
    this.x = random(1200);
    this.y = random(700);
    this.theta = random(TWO_PI);
    this.vel = random(0.1, 1);
    this.hidden = false;
    this.size = 20;  // Sunshine size
  }

  update() {
    if (this.hidden) return;

    // Change direction when sunshine hits the edge
    if (this.x > width + this.size || this.x < -this.size || this.y > height + this.size || this.y < -this.size) {
      this.theta = PI + this.theta;  // Reverse direction when it hits edges
    }

    // Update position
    this.x += this.vel * cos(this.theta);
    this.y += this.vel * sin(this.theta);
  }

  display() {
    if (this.hidden) return;

    push();
    translate(this.x, this.y);
    rotate(this.theta);  // Rotate sunshine based on direction
    image(sunshine, -this.size / 2, -this.size / 2, this.size, this.size);  // Center the sunshine on the position
    pop();
  }

  hide() {
    if (this.hidden) return;

    // Ignore input if mouse is outside the canvas
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
      return;
    }

    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.size / 2) {
      this.hidden = true;
      score += 5;
      console.log("Sunshine " + score);
    }
  }


}



function showGothel() {
  for (let i = 0; i < randomTimes.length; i++) {
    if (abs(timerValue - randomTimes[i]) < 0.1 && !slidingIn && !slidingOut) { // Check if timerValue is within 0.1 seconds of randomTimes[i]
      slideStartTime = millis();
      slidingIn = true;
      break;
    }
  }

  if (slidingIn) {
    slideX += slideSpeed;
    if (slideX >= 0) {
      slideX = 0;
      slidingIn = false;
      setTimeout(() => {
        slidingOut = true;
      }, slideDuration);
    }
  }

  if (slidingOut) {
    slideX -= slideSpeed;
    if (slideX <= -slideImageWidth) {
      slideX = -slideImageWidth;
      slidingOut = false;
    }
  }


  image(slideImage, slideX, height - slideImageHeight, slideImageWidth, slideImageHeight);


}