var RecievedPublicKey = new ArrayBuffer()

var socket;
var recievedMessage
var data2
var dataSend

//arrays containing the messages sent and received
var sentMessage = "";
var sentEncryptedMessages = "";


var recievedEncryptionMessages = "";
var recievedMessages = "";

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
  recievedEncryptionMessages = (String(m))

  const decryptedString = await decryptMessage(m);

  // Convert string to binary
  const binaryString = [...decryptedString]
  .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
  .join('');

  // Decode Hamming
  const hammingDecoded = hammingCode.decode(binaryString);

  // Convert binary string back to readable message
  const message = hammingDecoded.match(/.{1,8}/g)
    .map(b => String.fromCharCode(parseInt(b, 2)))
    .join('');

    recievedMessages = message;
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