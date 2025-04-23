var socket;

let x = 0
let y = 0
let player
let playerx = 0   
let playerz = 0
let playery = 0
let movementspeed = 10
let runmultiplier = 1

let multx = 0
let multy = 0
let multz = 0

let recoil = 0
let recoilammount = 10
let recoveryspeed = 2
let recoilmultiplier = 1

let sliderecoil = 0
let sliderecoilmultiplier = 3

let ads = 10

//multiplayer variables
multx = 0
multy = 0
multz = 0

multrotatex = 0
multrotatey = 0

multbullx = 0
multbully = 0
multbullz = 0


let multsliderecoil = 0

//bullets
let bullets = []

//higher number equals lower sensitivity
let lookspeed = 4

//saving
let jsonData = {}

function preload(){
  pistol = loadModel('assets/pistol1.obj', true)
  pistolslide = loadModel('assets/pistol2slide.obj', true)
  pistolframe = loadModel('assets/pistol2frame.obj', true)
  pistolarm = loadModel('assets/pistol2arm.obj', true)

  shoot = loadSound('assets/shoot.wav')

  dark = loadImage('assets/dark.png')
  blaa = loadImage('assets/blue.jpg')
}

function setup() {
  createCanvas(1600, 800, WEBGL);
  background(50);
  socket = io.connect('http://localhost:3000');
  socket.on('mouse', NewDrawing);
  angleMode(DEGREES)
  rectMode(CENTER)
  player = new Player()
  bullets.push(new bullet())

  //save and load json
  let saveButton = createButton("Save JSON");
  saveButton.mousePressed(savePlayerData);

}

function NewDrawing(data){
  multx = data.x
  multy = data.y
  multz = data.z

  multrotatex = data.rx
  multrotatey = data.ry
  
  multsliderecoil = data.sr

  multbullx = data.bullx
  multbully = data.bully
  multbullz = data.bullz
}
function draw() {  

  ambientLight(255)
  directionalLight(255, 255, 255, new p5.Vector(1, 1, 1))
  background(200, 200, 250);
  player.update()


  
  //player look
  translate(0, 60, 570)
  rotateX(165)
  noStroke()
  fill(200)
  rotateX(180)
  translate(0,-50,102.3)

  //pistol
  push()
  translate(100 - ads, 70, -300)
  rotateX(190 - recoil)
  rotateY(180)
  fill(50)
  model(pistolframe)
  push()
  translate(0, 0, 150)
  fill(205)
  model(pistolarm)
  pop()
  translate(0, 55, -8 + sliderecoil)
  fill(100)
  model(pistolslide)
  translate(0, 14, 70)
  fill(255, 0, 0)
  torus(2, 0.1)
  sphere(0.3)
  pop()

  rotateX(player.lookAngle.x)
  rotateY(player.lookAngle.y)

  translate(0 + playerx ,0 + playery,-600 - playerz)

  stroke(0.0001)
  rotateX(180)
  texture(blaa)
  box(100, 500)
  texture(dark)
  translate(0, -400, 0)
  rotateX(90)
  plane(10000)
  
  //bullet updates
  for(let i = 0; i<bullets.length;i++){
    bullets[i].update()
    bullets[i].draw()
  }
  if(bullets.length > 10){
    bullets.splice(0, 1)
  }
  //bullet multiplayer drawing
  push()
  
  translate(multbullx, multbully, multbullz)
  sphere(50)
  
  pop()


  //recoil
  if(recoil > 0){
    recoil -= recoveryspeed
  }
  if(sliderecoil > 0){
    sliderecoil -= recoveryspeed * sliderecoilmultiplier
  }
  if(sliderecoil < 0){
    sliderecoil = 0
  }
  //ads
  if(keyIsDown(69)){
    ads = 100
  } else {
    ads = 0
  }


  //package sending
  var data = {
    x: playerx,
    y: playery,
    z: playerz,
    rx: player.lookAngle.x + recoil,
    ry: player.lookAngle.y,
    sr: sliderecoil,

    bullx: -bullets[bullets.length-1].y,
    bully: -bullets[bullets.length-1].x,
    bullz: bullets[bullets.length-1].z
  }
  socket.emit('mouse', data)
    //multiplayer
    push()
    noStroke()
    fill(200)
    translate(-multx + 60, -multz - 570, -multy - 250)
    rotateZ(-multrotatey)
    //rotateX(-multrotatex)
    rotateX(90)
    cylinder(80, 500)
    rotateX(-multrotatex)
    translate(80, -100, -170)
    rotateZ(180)
    model(pistolarm)
    translate(0, 0, -145)
    fill(50)
    model(pistolframe)
    translate(0, 50, 0 + multsliderecoil)
    fill(100)
    model(pistolslide)
    pop()

}

  function mousePressed(){
    if(sliderecoil <= 0){
    shoot.play()
    recoil = recoilammount*2
    sliderecoil = 50

      bullets.push(new bullet())


      x += random(0, recoilammount * recoilmultiplier * 2)
      y += random(-recoilammount * recoilmultiplier, recoilammount * recoilmultiplier)
    }
  }


  function savePlayerData() {
    let jsonData = {
      player: {
        position: {
          x: playerx,
          y: playery,
          z: playerz,
        },
        rotation: {
          x: player.lookAngle.x,
          y: player.lookAngle.y,
        },
      },
    };
  
    // Save jsonData to a JSON file named "playerData.json"
    saveJSON(jsonData, "playerData.json");
  }
