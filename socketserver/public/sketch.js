const crypto = require('js-crypto-rsa');
const RSAUtils = {
  // Generate RSA Key Pair
  generateKeyPair: () =>
    new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        'rsa',
        {
          modulusLength: 2048, // Key length
          publicKeyEncoding: { type: 'spki', format: 'pem' }, // Public key encoding
          privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, // Private key encoding
        },
        (err, publicKey, privateKey) => {
          if (err) reject(err);
          resolve({ publicKey, privateKey });
        }
      );
    }),

  // Encrypt Data with Public Key
  encrypt: (publicKey, plaintext) =>
    crypto.publicEncrypt(publicKey, Buffer.from(plaintext)),

  // Decrypt Data with Private Key
  decrypt: (privateKey, encrypted) =>
    crypto.privateDecrypt(privateKey, encrypted),

  // Sign Data with Private Key
  sign: (privateKey, message) => {
    const signer = crypto.createSign('sha256');
    signer.update(message);
    signer.end();
    return signer.sign(privateKey, 'base64');
  },

  // Verify Signature with Public Key
  verify: (publicKey, message, signature) => {
    const verifier = crypto.createVerify('sha256');
    verifier.update(message);
    verifier.end();
    return verifier.verify(publicKey, signature, 'base64');
  },
};

module.exports = RSAUtils;






crypto.generateKey()


const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,         // Key size in bits
  publicKeyEncoding: {
    type: 'spki',              // Recommended format for public keys
    format: 'pem'              // Output as PEM string
  },
  privateKeyEncoding: {
    type: 'pkcs8',             // Recommended format for private keys
    format: 'pem',
    cipher: 'aes-256-cbc',     // Optional: encrypt private key
    passphrase: 'my-secret'    // Replace with your own secure passphrase
  }
});


console.log('Public Key:\n', publicKey);
console.log('Private Key:\n', privateKey); 




var socket;
var recievedMessage
var data2
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

function preload()
{
  
}

function setup() {

  createCanvas(windowWidth - 30, windowHeight - 30);
  background(50);





  //connects to localhost
  socket = io.connect('http://localhost:3000');
  socket.on('mouse', NewDrawing);
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

    dataSend = messageInput.value()
    data2 = {
      message: dataSend
    }
}

function sendData()
{
  //encodedMessage = encrypMessage(data.message)
  //decodedMessage = decryptMessage(encodedMessage)

  //console.log(data)
  //console.log(encodedMessage)
  //console.log(decodedMessage)

  socket.emit('mouse', data2)
}


