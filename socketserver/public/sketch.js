var socket;
var recievedMessage

function preload(){

}

function setup() {
  createCanvas(400, 400);
  background(50);

  //connects to localhost
  socket = io.connect('http://localhost:3000');
  socket.on('mouse', NewDrawing);
  
  //Input and message sending
  messageInput = createInput("")
  messageSend = createButton("Send message")
  messageSend.position(10, 100)
  messageSend.mousePressed(sendData)
}

function NewDrawing(data){
  recievedMessage = data.message
}
function draw() {  
  background(100, 100, 100);
  text(recievedMessage ,10, 10)

}

function sendData()
{
  
  var data = {
    message: messageSend
  }

  console.log(data)
  socket.emit('mouse', data)

  
}
