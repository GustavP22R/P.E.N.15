var socket;
var recievedMessage
var data
var dataSend

let numberString = "";
let decodedString = "";

var encodedMessage
var decodedMessage

//Input and message positions
xInput = 50;
yInput = 110;

xSend = 220;
ySend = 50;

//Titel positions
xMessageBox = xInput - 5;

XInsertMessage = xInput - 6;


function preload(){

}

function setup() {
  createCanvas(windowWidth - 30, windowHeight - 30);
  background(50);
  calculateKeys()



  //connects to localhost
  socket = io.connect('http://localhost:3000');
  socket.on('mouse', NewDrawing);
  setupFrontEnd()
  //Input and message sending

}

function NewDrawing(data){
  recievedMessage = data.message
}
function draw() {  
  //Background design
  background(3, 22, 52);
  drawFrontEnd()
  //text(recievedMessage ,10, 10)

    dataSend = messageInput.value()
    data = {
      message: dataSend
    }
}

function sendData()
{
  encodedMessage = encrypMessage(data.message)
  decodedMessage = decryptMessage(encodedMessage)

  console.log(data)
  console.log(encodedMessage)
  console.log(decodedMessage)

  socket.emit('mouse', data)
}
