var socket;
var recievedMessage
var data2
var dataSend


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
  socket.on('key', NewDrawing)
  setupFrontEnd()

}

function NewDrawing(data){
  recievedMessage = data.message

}
function draw() {  
  //Background design
  background(3, 22, 52);
  drawFrontEnd()
  //text(recievedMessage ,10, 10)
}

async function sendData()
{
  generateRSAKeyPair().then(() => {
    const message = String(messageInput.value());
    console.log("Original Message:", message);

    encryptMessage(message).then(encrypted => {
      

      decryptMessage(encrypted).then(decrypted => {
        console.log("Decrypted Message:", decrypted);
      });
    });
  });


}

async function emitData() {
  await generateRSAKeyPair(); // Wait for keys to be generated
  await exchangeKeys(publicKey)
  const encrypted = await encryptMessage(messageInput.value());
  

  console.log("Encrypted Message:", encrypted);

}

async function exchangeKeys(pKey) {
  const RSAkey = await exportPublicKeyToBase64(pKey); // Wait for key to be exported
  socket.emit('key', RSAkey) // send as base64 for transport)
}