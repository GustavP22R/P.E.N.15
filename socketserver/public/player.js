
class Player{
    constructor(){
      this.lookAngle = new p5.Vector(0,0);
      this.velocity = new p5.Vector(0,0,0)
      this.pos = new p5.Vector(playerx, playery, playerz)
  
      this.jumpcooldown = 50
      this.jumpframe = -this.jumpcooldown
    }
    
    update(){
      //looking
      if(keyIsDown(38) && this.lookAngle.x < 80){
        this.lookAngle.x += lookspeed
      }
      if(keyIsDown(40) && this.lookAngle.x > -70){
        this.lookAngle.x += -lookspeed
      }
      if(keyIsDown(39)){
        this.lookAngle.y += lookspeed
      }
      if(keyIsDown(37)){
        this.lookAngle.y += -lookspeed
      }
  
      //movement
      if(keyIsDown(87)){
        //w
        playerz -= cos(player.lookAngle.y) * movementspeed * runmultiplier
        playerx -= sin(player.lookAngle.y) * movementspeed * runmultiplier
      }
  
      if(keyIsDown(83)){
        //s
        playerz += cos(player.lookAngle.y) * movementspeed * runmultiplier
        playerx += sin(player.lookAngle.y) * movementspeed * runmultiplier
      }
  
      if(keyIsDown(65)){
        //a
        playerx += cos(player.lookAngle.y) * movementspeed * runmultiplier
        playerz -= sin(player.lookAngle.y) * movementspeed * runmultiplier
      }
  
      if(keyIsDown(68)){
        //d
        playerx -= cos(player.lookAngle.y) * movementspeed * runmultiplier
        playerz += sin(player.lookAngle.y) * movementspeed * runmultiplier
      }
      //running
      if(keyIsDown(87) && keyIsDown(16)){
        //w
        runmultiplier = 2
      } else if(keyIsDown(83) && keyIsDown(16)){
        //s
        runmultiplier = 2
      } else if(keyIsDown(65) && keyIsDown(16)){
        //a
        runmultiplier = 2
      } else if(keyIsDown(68) && keyIsDown(16)){
        //d
        runmultiplier = 2
      } else {
        runmultiplier = 1
      }
      //jumping
      if(keyIsDown(32) && this.jumpframe < frameCount - this.jumpcooldown){
        this.velocity.y = 15
        this.jumpframe = frameCount
      }
      playery += this.velocity.y
  
      if(playery > 0){
        this.velocity.y += -0.8
      }else{
        this.pos.y=0
        this.velocity.y = 0
      }
      }
    }
  