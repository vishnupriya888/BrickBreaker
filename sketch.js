// Creating variable for paddle and its animation
var paddle, padleanim, bulletPanim;

// Creating variable for ball and its image
var ball, ballimg;

// All the variable for UI of the game and its images
var start, startImg;
var restart, restartImg;

// Variable for Game States
var serve, play, end;
var gamestate = "serve";

// Variables for tile formation
var tile;
var rand;

// Variables for Groups
var tilegroup;
var bulletG, bulletG2;

// Variables for images of tiles
var tileimg1;
var tileimg2;
var tileimg3;
var tileimg4;
var tileimg5;
var tileimg6;
var tileimg7;
var tileimg8;
var tileimg9;
var tileimg10;

// Sounds
var Pop;

// Variables for bullet power-up
var bulletPower, bulletPowerImg;
var bullet1, bulletImg;

// Variables for extend power-up
var extendPower, extendPowerImg;

// Variables for fire power-up
var firePower, firePowerImg;

// Variable for life
var life, lifeImg;

// Variable for scoring system
var score, lives;

function preload() {
  // loading background image
  bg = loadImage("Images/bg.png");

  // loading UI images
  startImg = loadImage("Images/start.png");
  restartImg = loadImage("Images/restart.png");

  // loading paddle animation
  paddleanim = loadAnimation(
    "Images/NormalPaddle/paddle1.png",
    "Images/NormalPaddle/paddle2.png",
    "Images/NormalPaddle/paddle3.png"
  );
  bulletPanim = loadAnimation(
    "Images/BulletPaddle/bulletP1.png",
    "Images/BulletPaddle/bulletP2.png",
    "Images/BulletPaddle/bulletP3.png"
  );
  extendPanim = loadAnimation("Images/extendPaddle.png");

  // loading ball image
  ballimg = loadImage("Images/ball.png");

  // life pic
  lifeImg = loadImage("Images/life.png");

  // loading the tiles images
  tileimg1 = loadImage("Images/tiles/tile1.png");
  tileimg2 = loadImage("Images/tiles/tile2.png");
  tileimg3 = loadImage("Images/tiles/tile3.png");
  tileimg4 = loadImage("Images/tiles/tile4.png");
  tileimg5 = loadImage("Images/tiles/tile5.png");
  tileimg6 = loadImage("Images/tiles/tile6.png");
  tileimg7 = loadImage("Images/tiles/tile7.png");
  tileimg8 = loadImage("Images/tiles/tile8.png");
  tileimg9 = loadImage("Images/tiles/tile9.png");
  tileimg10 = loadImage("Images/tiles/tile10.png");

  // loading images for bullet power-up
  bulletPowerImg = loadImage("Images/power-ups/bulletpower.png");
  bulletImg = loadImage("Images/bullet.png");

  // loading images for extend power-up
  extendPowerImg = loadImage("Images/power-ups/extendpower.png");

  // loading images for fire power-up
  firePowerImg = loadImage("Images/power-ups/firepower.png");
  fireBall = loadAnimation(
    "Images/Fireball/fireball.png",
    "Images/Fireball/fireball1.png",
    "Images/Fireball/fireball.png"
  );

  // loading the sounds
  Pop = loadSound("Audio/pop.mp3");
  Bullet = loadSound("Audio/laser.mp3");
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);

  score = 0;
  lives = 3;

  // creating life image
  life = createSprite(40, 40);
  life.addImage(lifeImg);
  life.scale = 0.4;

  // creating UI sprites
  start = createSprite(width / 2, height / 2 + 100);
  start.addImage(startImg);
  start.scale = 0.7;
  start.visible = true;

  restart = createSprite(width / 2, height / 2 + 100);
  restart.addImage(restartImg);
  restart.scale = 0.7;
  restart.visible = false;

  // creating paddle and ball sprites
  paddle = createSprite(width / 2, height - 40);
  paddle.addAnimation("normal", paddleanim);
  paddle.addAnimation("bullet", bulletPanim);
  paddle.addAnimation("extend", extendPanim);
  paddle.scale = 0.3;

  ball = createSprite(width / 2, height / 2);
  ball.addImage(ballimg);
  ball.scale = 0.2;

  // creating groups
  tilegroup = new Group();
  bulletG = new Group();
  extendG = new Group();
  fireG = new Group();
  fireG2 = new Group();
  bulletG2 = new Group();

  // calling spawn tile function
  tilespawn();
}

function draw() {
  background(bg);

  // functions that will happen on gamestate serve
  if (gamestate === "serve") {
    // UI changes
    start.visible = true;
    restart.visible = false;

    // start the game as soon as the mouse is pressed over start
    if (mousePressedOver(start) || touches.length > 0) {
      touches = [];
      gamestate = "play";
      ball.velocityX = -13;
      ball.velocityY = 14;
    }
  }

  // functions that will happen on gamestate play and end
  if (gamestate === "play") {
    // UI changes
    start.visible = false;
    restart.visible = false;

    // guiding the paddle x position to mouse x position
    paddle.x = mouseX;

    // making bounceoff function for paddle and the edges
    if (ball.isTouching(paddle)) {
      ball.y = ball.y - 5;
      ball.velocityY = -ball.velocityY;
    }

    if (ball.y <= 0) {
      ball.velocityY = -ball.velocityY;
    }

    if (ball.x <= 0) {
      ball.velocityX = -ball.velocityX;
    }

    if (ball.x >= windowWidth) {
      ball.velocityX = -ball.velocityX;
    }

    // breaking the tiles and increasing the score
    for (var i = 0; i < tilegroup.length; i++) {
      if (tilegroup.get(i) != null && ball.isTouching(tilegroup.get(i))) {
        tilegroup.get(i).destroy();
        ball.velocityY = -ball.velocityY;
        Pop.play();
        score += 10;
      }
    }

    // picking up the bullet power up
    for (var i = 0; i < bulletG.length; i++) {
      if (bulletG.get(i) != null && paddle.isTouching(bulletG.get(i))) {
        bulletG.get(i).destroy();
        paddle.changeAnimation("bullet", bulletPanim);
        //setInterval(fireBullet, 1000);
        setTimeout(actualanim, 2000);
        fireBullet();
        Bullet.play();
      }
    }

    // picking up the extend power up
    for (var i = 0; i < extendG.length; i++) {
      if (extendG.get(i) != null && paddle.isTouching(extendG.get(i))) {
        extendG.get(i).destroy();
        paddle.changeAnimation("extend", extendPanim);
        setTimeout(actualanim, 6000);
      }
    }

    // picking up the fire power up
    for (var i = 0; i < fireG.length; i++) {
      if (fireG.get(i) != null && paddle.isTouching(fireG.get(i))) {
        fireG.get(i).destroy();
        paddle.changeAnimation("bullet", bulletPanim);
        setTimeout(actualanim, 2000);
        shootFire();
      }
    }

    // breaking the tiles,breaking the bullet and increasing the score
    for (var i = 0; i < tilegroup.length; i++) {
      for (var j = 0; j < bulletG2.length; j++) {
        if (tilegroup.get(i) != null && bulletG2.isTouching(tilegroup.get(i))) {
          tilegroup.get(i).destroy();
          bulletG2.get(j).destroy();
          Pop.play();
          score += 10;
        }
      }
    }

    // breaking the tiles and increasing the score
    for (var i = 0; i < tilegroup.length; i++) {
      for (var j = 0; j < fireG2.length; j++) {
        if (tilegroup.get(i) != null && fireG2.isTouching(tilegroup.get(i))) {
          tilegroup.get(i).destroy();
          Pop.play();
          score += 10;
        }
      }
    }

    // ending the game
    if (ball.y >= windowHeight + 5 && ball.y <= windowHeight + 20) {
      lives--;
      ball.x = width / 2;
      ball.y = height / 2;
      if (lives === 0) {
        gamestate = "end";
      }
    }
    for (var i = 0; i < tilegroup.length; i++) {
      if (tilegroup.get(i) != null && tilegroup.get(i).y >= windowHeight) {
        gamestate = "end";
        lives = 0;
      }
    }

    // calling the power-up functions
    extendpower();
    bulletpower();
    firepower();
    addBricks();
  } else if (gamestate === "end") {
    reset();
  }
  drawSprites();

  // displaing the score
  fill("white");
  textSize(32);
  text("Score: " + score, windowWidth - 300, 50);
  text(lives, 80, 50);
}

// functions
function actualanim() {
  paddle.changeAnimation("normal", paddleanim);
}

function reset() {
  restart.visible = true;
  if (mousePressedOver(restart) || touches.length > 0) {
    touches = [];
    gamestate = "play";
    ball.x = width / 2;
    ball.y = height / 2;
    ball.velocityX = -15;
    ball.velocityY = 16;
    tilegroup.destroyEach();
    tilespawn();
    paddle.changeAnimation("normal", padleanim);
    lives = 3;
    score = 0;
  }
}

function tilespawn() {
  for (var x = 52.5; x < windowWidth; x = x + windowWidth / 13) {
    for (var y = 100; y <= 250; y = y + 50) {
      tile = createSprite(x, y);
      tile.scale = 0.25;
      tilegroup.add(tile);
      rand = Math.round(random(1, 10));
      switch (rand) {
        case 1:
          tile.addImage(tileimg1);
          break;
        case 2:
          tile.addImage(tileimg2);
          break;
        case 3:
          tile.addImage(tileimg3);
          break;
        case 4:
          tile.addImage(tileimg4);
          break;
        case 5:
          tile.addImage(tileimg5);
          break;
        case 6:
          tile.addImage(tileimg6);
          break;
        case 7:
          tile.addImage(tileimg7);
          break;
        case 8:
          tile.addImage(tileimg8);
          break;
        case 9:
          tile.addImage(tileimg9);
          break;
        case 10:
          tile.addImage(tileimg10);
          break;
        default:
          break;
      }
    }
  }
}

function shootFire() {
  bullet1 = createSprite(paddle.x - paddle.width / 2, windowHeight - 35);
  bullet1.addAnimation("s", fireBall);
  bullet1.scale = 0.8;
  bullet1.velocityY = -12;
  bullet2 = createSprite(paddle.x + paddle.width / 2, windowHeight - 35);
  bullet2.addAnimation("s", fireBall);
  bullet2.scale = 0.8;
  bullet2.velocityY = -12;
  fireG2.add(bullet1);
  fireG2.add(bullet2);
  bulletG2.setLifeTimeEach = windowHeight / 12;
}

function fireBullet() {
  bullet1 = createSprite(paddle.x - paddle.width / 2, windowHeight - 35);
  bullet1.addImage(bulletImg);
  bullet1.scale = 0.8;
  bullet1.velocityY = -12;
  bullet2 = createSprite(paddle.x + paddle.width / 2, windowHeight - 35);
  bullet2.addImage(bulletImg);
  bullet2.scale = 0.8;
  bullet2.velocityY = -12;
  bulletG2.add(bullet1);
  bulletG2.add(bullet2);
  bulletG2.setLifeTimeEach = windowHeight / 12;
}

function addBricks() {
  for (var i = 0; i < tilegroup.length; i++) {
    if (tilegroup.get(i) != null && frameCount % 250 === 0) {
      tilegroup.get(i).y = tilegroup.get(i).y + 50;
    }
  }
  if (frameCount % 250 === 0) {
    for (var x = 52.5; x < windowWidth; x = x + windowWidth / 13) {
      tile = createSprite(x, 100);
      tile.scale = 0.25;
      tilegroup.add(tile);
      rand = Math.round(random(1, 10));
      switch (rand) {
        case 1:
          tile.addImage(tileimg1);
          break;
        case 2:
          tile.addImage(tileimg2);
          break;
        case 3:
          tile.addImage(tileimg3);
          break;
        case 4:
          tile.addImage(tileimg4);
          break;
        case 5:
          tile.addImage(tileimg5);
          break;
        case 6:
          tile.addImage(tileimg6);
          break;
        case 7:
          tile.addImage(tileimg7);
          break;
        case 8:
          tile.addImage(tileimg8);
          break;
        case 9:
          tile.addImage(tileimg9);
          break;
        case 10:
          tile.addImage(tileimg10);
          break;
        default:
          break;
      }
    }
  }
}

function mouseDragged() {
  paddle.x = mouseX;
}

function bulletpower() {
  if (frameCount % 350 === 0) {
    rand = Math.round(random(10, windowWidth - 10));
    bulletPower = createSprite(rand, 0);
    bulletPower.addImage(bulletPowerImg);
    bulletPower.scale = 0.2;
    bulletPower.velocityY += 6;
    bulletG.add(bulletPower);
  }
}

function extendpower() {
  if (frameCount % 250 === 0) {
    rand = Math.round(random(10, windowWidth - 10));
    extendPower = createSprite(rand, 0);
    extendPower.addImage(extendPowerImg);
    extendPower.scale = 0.2;
    extendPower.velocityY += 6;
    extendG.add(extendPower);
  }
}

function firepower() {
  if (frameCount % 450 === 0) {
    rand = Math.round(random(10, windowWidth - 10));
    firePower = createSprite(rand, 0);
    firePower.addImage(firePowerImg);
    firePower.scale = 0.2;
    firePower.velocityY += 6;
    fireG.add(firePower);
  }
}
