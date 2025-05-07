var RecievedPublicKey = new ArrayBuffer()

var socket;
var recievedMessage
var data2
var dataSend

//arrays containing the messages sent and received
var sentMessages = []
var sentEncryptedMessages = []


var recievedEncryptionMessages = ["2","4"]
var recievedMessages = []


var sent

//Input and message positions
xInput = 50;
yInput = 110;

xSend = 220;
ySend = 50;

//Titel positions
xMessageBox = xInput - 5;

XInsertMessage = xInput - 6;

function preload()
{
  
}

function setup() {
  


  createCanvas(windowWidth - 30, windowHeight - 30);
  background(50);




  //connects to localhost
  socket = io.connect('http://localhost:3000');
  socket.on('mouse', NewDrawing);
  socket.on('user-joined', initializeRSA)
  socket.on('message', messageRecieved)
  setupFrontEnd()
  
}

async function messageRecieved(m)
{
  recievedEncryptionMessages.push(String(m))
  plainText = await decryptMessage(m)
  console.log(plainText)
  recievedMessages.push(String(plainText))
}

async function NewDrawing(data)
{
  RecievedPublicKey = data
  UsedPublicKey = await importRsaPublicKey(RecievedPublicKey)
  console.log(RecievedPublicKey)
}
function draw() {  
 
  //Background design
  background(3, 22, 52);
  drawFrontEnd()
  //text(recievedMessage ,10, 10)
}