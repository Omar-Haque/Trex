var trex, ground, invground, trexrunning, PLAY, END, gameState, score, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, cloud, cloudanimation, obstaclegroup, cloudgroup, deadtrex, gameover_image, gameover, restart, restart_image;

function preload(){
  trexrunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundanimation = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  cloudanimation = loadImage("cloud.png");
  deadtrex = loadAnimation("trex_collided.png");
  gameover_image = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");
}

function setup() {
  
  //Create a canvas
  createCanvas(600, 200);
  
  //Create trex sprite
  trex = createSprite(40, 160);
  trex.addAnimation("trex", trexrunning);
  trex.addAnimation("X_X", deadtrex); 
  trex.scale = 0.5;
  trex.setCollider("circle", 5, 0, 50);
  
  //Create ground
  ground = createSprite(200, 180);
  ground.addImage("Ground", groundanimation);
  
  //Create invisible ground
  invground = createSprite(200, 190, 400, 5);
  invground.visible = false;
  
  //Create gameState variables
  PLAY = 1;
  END = 0;
  gameState = PLAY;
  
  //Create score
  score = 0;
  
  //Create the obstaclegroup and cloudgroup
  obstaclegroup = new Group();
  cloudgroup = new Group();
  
  //Create sprite for gameover
  gameover = createSprite(300, 70);
  gameover.addImage(gameover_image);
  gameover.visible = false;
  gameover.scale = 0.5;
  
  //Create sprite for restart
  restart = createSprite(300, 120);
  restart.addImage(restart_image);
  restart.visible = false;
  restart.scale = 0.5;
}

function draw() {
  
  //Set the background color
  background(250);
  
  if(gameState === PLAY){
    
    //Make the ground move
    ground.velocityX = -(6 + 3*score/100);
    
    //Reset the position of ground
    if(ground.x < 0){
      ground.x = ground.width / 2;
    }
    
    
    
    //Jump when space key is pressed
    if(keyDown("space") && trex.y > 159){
      trex.velocityY = -13;
    }
    
    //Increase score
    score = score + Math.round(getFrameRate() / 40);
    
    //Add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //Change gameState to END if trex is touching any obstacle
    if(obstaclegroup.isTouching(trex)){
      gameState = END;
      }
    
    //Spawn the clouds and obstacles
    clouds();
    obstacles();
    
  }
  
  //If gameState is END
  else if(gameState === END){
    
    //Set velocity of each game object to zero
    trex.velocityX = 0;
    trex.velocityY = 0;
    ground.velocityX = 0;
    cloudgroup.setVelocityXEach(0);
    obstaclegroup.setVelocityXEach(0);
    
    //Set the lifetime of game objects so that they are not destroyed
    cloudgroup.setLifetimeEach(-1);
    obstaclegroup.setLifetimeEach(-1);
    
    //Change the animation of the trex
    trex.changeAnimation("X_X", deadtrex);
    gameover.visible = true;
    restart.visible = true;
    
    //Restart the game when the restartbutton is pressed
    if(mousePressedOver(restart)){
      resetbutton();
    }
  }
  
  //Display score
  textSize(20);
  textFont("Georgia");
  text("Score: " + score, 470, 30);

  //Make the trex walk on the invisible ground
  trex.collide(invground);
  
  //Display all the sprites on the screen
  drawSprites();
}

function obstacles(){
  
  if(frameCount % 100 === 0){
    
    //Create an obstacle sprite
    obstacle = createSprite(600, 160);
    obstacle.scale = 0.5;
    
    //Create rand to generate random numbers between 1 and 6
    var rand = Math.round(random(1, 6));
    
    //Make the obstacles move
    obstacle.velocityX = -(6 + 3*score/100);
    obstaclegroup.add(obstacle);
    
    //Set random animations to the obstacle sprite
    switch(rand){
        
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
    
    }
  
  }
  
}

function clouds(){
  
  if(frameCount % 45 === 0){
    
    //Create a cloud sprite
    cloud = createSprite(600, 300);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudanimation);
    
    //Make the clouds move
    cloud.velocityX = -3;
    
    //Resize the cloud
    cloud.scale = 0.5;
    
    //Add cloud sprite to clouds group
    cloudgroup.add(cloud);
    
    //Adjust the depth
    trex.depth = cloud.depth + 1;
    restart.depth = cloud.depth + 1;
    
    //Set lifetime to prevent memory leak
    cloud.lifetime = 210;
  }
  

}

function resetbutton(){
  gameState = PLAY;
  score = 0;
  restart.visible = false;
  gameover.visible = false;
  obstaclegroup.destroyEach();
  cloudgroup.destroyEach();
  trex.changeAnimation("trex", trexrunning);
}

