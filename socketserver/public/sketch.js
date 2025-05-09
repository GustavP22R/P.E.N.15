var RecievedPublicKey = new ArrayBuffer()

var socket;
var recievedMessage
var data2
var dataSend

//arrays containing the messages sent and received
var sentMessage = "";
var sentEncryptedMessages = "";

var binaryMessage = "";

var hammingEncoded = "";
var hammingDecoded = "";

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


function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function messageRecieved(m) {
   recievedEncryptionMessages = String(m.message);

   // Decode the base64 encrypted message back into an ArrayBuffer
   const encryptedMessage = base64ToArrayBuffer(m.message);
   const encryptedHamming = base64ToArrayBuffer(m.hamming)
   // Decrypt the message
   const decryptedString = await decryptMessage(encryptedMessage);
   const MessageHamming = await decryptMessage(encryptedHamming)
    //console.log("Decrypted message: " + String(decryptedString))
   // Convert string to binary (optional: depends on your Hamming decoding step)
  //  const binaryString =    [...decryptedString]
  //     .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
  //     .join('');

   // Decode Hamming
   //const hammingDecoded = await hammingCode.decode(binaryString);  // Hamming decode

   // Convert binary string back to readable message
  //  const message = await hammingDecoded.match(/.{1,8}/g)
  //     .map(b => String.fromCharCode(parseInt(b, 2)))
  //     .join('');

   recievedMessages = decryptedString; // Store the decrypted message
   hammingDecoded = MessageHamming
}

// Convert base64 string back to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);  // Decode base64 to binary string
  const length = binaryString.length;
  const arrayBuffer = new ArrayBuffer(length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return arrayBuffer;
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



// RSA CRYPT: JS
let publicKey, privateKey;  // Declare the public and private key globally

async function generateRSAKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  privateKey = keyPair.privateKey;
  publicKey = keyPair.publicKey;
  console.log("RSA Key Pair Generated");
}

  

  
  function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let length = bytes.byteLength;
    
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return window.btoa(binary);  // Use btoa() to convert to base64
  }
  
  

 // Decryption function
async function decryptMessage(encryptedMessage) {
  const decryptedMessage = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedMessage
  );
  console.log(decryptedMessage)
  return new TextDecoder().decode(decryptedMessage); // Return the decoded message as a string

}


  async function exportPublicKeyToBase64(publicKey) {
    const spki = await crypto.subtle.exportKey("spki", publicKey);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(spki)));
    return b64;
  }
  
  async function importRsaPublicKey(base64Key) {
    // 1. Decode base64 to binary string
    const binaryDerString = atob(base64Key);
  
    // 2. Convert binary string to Uint8Array
    const binaryDer = new Uint8Array([...binaryDerString].map(char => char.charCodeAt(0)));
  
    // 3. Import the key using Web Crypto API
    return await crypto.subtle.importKey(
      "spki",                     // format for public RSA keys
      binaryDer.buffer,          // key data
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,                       // extractable
      ["encrypt"]                 // key usages
    );
  }

async function exchangeKeys(pKey) 
{
  const RSAkey = await exportPublicKeyToBase64(pKey); // Wait for key to be exported
  socket.emit('mouse',RSAkey) // send as base64 for transport)
}

async function initializeRSA() 
{
  await generateRSAKeyPair();
  await exchangeKeys(publicKey) 
}


async function generateSHA256Bits(inputMessage) {
  const encoder = new TextEncoder();
  let resultBits = '';
  let counter = 0;

  while (resultBits.length < 100000000) {
      const msg = inputMessage + counter;
      const data = encoder.encode(msg);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashBits = hashArray.map(b => b.toString(2).padStart(8, '0')).join('');
      resultBits += hashBits;
      counter++;
  }

  return resultBits.slice(0, 100000000);
}

function stringToBinary(str) {
  return str.split('')   // Split the string into an array of characters
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0')) // Convert each char to binary with 8 bits
      .join(''); // Join all the binary strings into one continuous string
}

/**
 * hammingEncode - encode binary string input with hamming algorithm
 * @param {String} input - binary string, '10101'
 * @returns {String} - encoded binary string
 */
function hammingEncode(input) {
	if (typeof input !== 'string' || input.match(/[^10]/)) {
		return console.error('hamming-code error: input should be binary string, for example "101010"');
	}

	var output = input;
	var controlBitsIndexes = [];
	var controlBits = [];
	var l = input.length;
	var i = 1;
	var key, j, arr, temp, check;

	while (l / i >= 1) {
		controlBitsIndexes.push(i);
		i *= 2;
	}

	for (j = 0; j < controlBitsIndexes.length; j++) {
		key = controlBitsIndexes[j];
		arr = output.slice(key - 1).split('');
		temp = chunk(arr, key);
		check = (temp.reduce(function (prev, next, index) {
			if (!(index % 2)) {
				prev = prev.concat(next);
			}
			return prev;
		}, []).reduce(function (prev, next) { return +prev + +next }, 0) % 2) ? 1 : 0;
		output = output.slice(0, key - 1) + check + output.slice(key - 1);
		if (j + 1 === controlBitsIndexes.length && output.length / (key * 2) >= 1) {
			controlBitsIndexes.push(key * 2);
		}
	}

	return output;
}


/**
 * hammingPureDecode - just removes from input parity check bits
 * @param {String} input - binary string, '10101'
 * @returns {String} - decoded binary string
 */
function hammingPureDecode(input) {
	if (typeof input !== 'string' || input.match(/[^10]/)) {
		return console.error('hamming-code error: input should be binary string, for example "101010"');
	}

	var controlBitsIndexes = [];
	var l = input.length;
	var originCode = input;
	var hasError = false;
	var inputFixed, i;
	
	i = 1;
	while (l / i >= 1) {
		controlBitsIndexes.push(i);
		i *= 2;
	}

	controlBitsIndexes.forEach(function (key, index) {
		originCode = originCode.substring(0, key - 1 - index) + originCode.substring(key - index);
	});

	return originCode;
}

/**
 * hammingDecode - decodes encoded binary string, also try to correct errors
 * @param {String} input - binary string, '10101'
 * @returns {String} - decoded binary string
 */
function hammingDecode(input) {
	if (typeof input !== 'string' || input.match(/[^10]/)) {
		return console.error('hamming-code error: input should be binary string, for example "101010"');
	}

	var controlBitsIndexes = [];
	var sum = 0;
	var l = input.length;
	var i = 1;
	var output = hammingPureDecode(input);
	var inputFixed = hammingEncode(output);


	while (l / i >= 1) {
		controlBitsIndexes.push(i);
		i *= 2;
	}

	controlBitsIndexes.forEach(function (i) {
		if (input[i] !== inputFixed[i]) {
			sum += i;
		}
	});

	if (sum) {
		output[sum - 1] === '1' 
			? output = replaceCharacterAt(output, sum - 1, '0')
			: output = replaceCharacterAt(output, sum - 1, '1');
	}
	return output;
}

/**
 * hammingCheck - check if encoded binary string has errors, returns true if contains error
 * @param {String} input - binary string, '10101'
 * @returns {Boolean} - hasError
 */
function hammingCheck(input) {
	if (typeof input !== 'string' || input.match(/[^10]/)) {
		return console.error('hamming-code error: input should be binary string, for example "101010"');
	}

	var inputFixed = hammingEncode(hammingPureDecode(input));

	return hasError = !(inputFixed === input);
}

/**
 * replaceCharacterAt - replace character at index
 * @param {String} str - string
 * @param {Number} index - index
 * @param {String} character - character 
 * @returns {String} - string
 */
function replaceCharacterAt(str, index, character) {
  return str.substr(0, index) + character + str.substr(index+character.length);
}

/**
 * chunk - split array into chunks
 * @param {Array} arr - array
 * @param {Number} size - chunk size
 * @returns {Array} - chunked array
 */
function chunk(arr, size) {
	var chunks = [],
	i = 0,
	n = arr.length;
	while (i < n) {
		chunks.push(arr.slice(i, i += size));
	}
	return chunks;
}


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.hammingCode = factory();
    }
}(this, function () {
    return {
    	encode: hammingEncode,
    	pureDecode: hammingPureDecode,
    	decode: hammingDecode,
    	check: hammingCheck
    };
}));


// FRONTEND : JS
let messageInput, messageSend, NewMessage;

function setupFrontEnd() {
    // Remove previous elements if they exist
    if (messageInput) messageInput.remove();
    if (messageSend) messageSend.remove();
    if (NewMessage) NewMessage.remove();

    // Recreate elements
    let inputWidth = windowWidth * 0.2;
    let inputHeight = windowHeight * 0.2;
    let inputX = windowWidth * 0.05;
    let inputY = windowHeight * 0.18;

    //Text size
    let fontSize = windowWidth * 0.010;

    //Input area
    messageInput = createElement('textarea');
    messageInput.attribute('placeholder', 'Message here');
    messageInput.attribute('maxlength', '193'); 
    messageInput.position(inputX, inputY);
    messageInput.size(inputWidth, inputHeight);


    let buttonWidth = 120 * windowWidth * 0.0007;
    let buttonHeight = 25 * windowHeight * 0.0015;

    let xSend = inputX * 3.2;
    let ySend = inputY - inputHeight * 0.5;

    //Send button
    messageSend = createButton("Send message");
    messageSend.position(xSend, ySend); 
    messageSend.size(buttonWidth, buttonHeight);
    messageSend.style('font-size', fontSize + 'px');
    messageSend.mousePressed(emitData);

    //New message button
    NewMessage = createButton("New Message");
    NewMessage.position(xSend, ySend + buttonHeight + 5 * windowHeight / 1000);
    NewMessage.size(buttonWidth, buttonHeight);
    NewMessage.style('font-size', fontSize + 'px');
    NewMessage.mousePressed(() => messageInput.value(""));
}

async function emitData() {
    await initializeRSA();  // Ensure RSA is initialized before emitting data
  
    // Get the message from the input field
    sentMessage = String(messageInput.value());
  
    // Convert the message to binary using the stringToBinary function
    binaryMessage = String(stringToBinary(sentMessage));
  
    // Hamming encode the binary message
    let hammingEncoded = hammingEncode(binaryMessage);  // Encode with Hamming
  
    // Now, encrypt the Hamming-encoded binary message
    const encryptedBase64 = await encryptMessage(String(sentMessage));
    const encryptedHamming = await encryptMessage(String(hammingEncoded))
    emitedData = {
      message: encryptedBase64,
      hamming: encryptedHamming
    }

    sentEncryptedMessages = encryptedBase64;  // Store the base64 string
  
    // Send the encrypted base64 message to the server
    socket.emit('message', emitedData);
    console.log("Encrypted Base64 Message:", encryptedBase64);
  }
  

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setupFrontEnd(); // Recalculate sizes/positions
}

async function encryptMessage(message) {
    const encodedMessage = new TextEncoder().encode(message);
  
    // Use 'publicKey' instead of 'UsedPublicKey'
    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      UsedPublicKey,  // Use the correct public key variable here
      encodedMessage
    );
  
    // Convert ArrayBuffer to base64 string for displaying
    const base64EncryptedMessage = arrayBufferToBase64(encryptedMessage);
    return base64EncryptedMessage; // Return the base64 string
  }

function drawFrontEnd() {
    background(3, 22, 52);

    // Background Panels
    fill(3, 101, 100);
    rect(20, 15, windowWidth/1.0567, windowHeight/2, 30);

    fill(3, 54, 73);
    rect(20, windowHeight / 2.1, windowWidth/1.0567, windowHeight / 2.2, 0, 0, 30, 30);

    // Input Box (Left)
    let inputBoxX = windowWidth * 0.05;
    let inputBoxY = windowHeight * 0.05 ;
    let inputBoxW = windowWidth * 0.2;
    let inputBoxH = windowHeight * 0.35;

    //Box top left
    fill(131, 163, 163);
    rect(inputBoxX * 0.7, inputBoxY, inputBoxW * 1.12, inputBoxH, 30);

    fill(255);
    textSize(16 * windowWidth/ 1300);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("Send message\nbelow", inputBoxX + inputBoxW  / 4, inputBoxY + windowHeight * 0.07);

    //Box bottom left
    fill(131, 163, 163);
    rect(inputBoxX * 0.7, inputBoxY * 10.5, inputBoxW * 1.12, inputBoxH, 30);

    //Title bottem left
    fill(255);
    text("Practical information", inputBoxX + inputBoxW  / 2.1, inputBoxY + windowHeight *0.54);

        //Bottom left text
        textSize(12 * windowWidth/ 1300);

        informationText = "This program showcases how encryption\nworks utilising RSA and how Error Control\nCoding works using Hamming Code\n\nThe program allows you to send your own\nmessage and follow the progress of the \nalgorithm"

        textAlign(LEFT);
        text(informationText, inputBoxX + inputBoxW  / 10000, inputBoxY + windowHeight *0.65);

    // Dynamic Message Boxes
    let columnCount = 4;
    let boxW = windowWidth * 0.15;
    let boxH = inputBoxH;
    let gap = windowWidth * 0.02;
    let startX = inputBoxX + inputBoxW + gap * 1.5;

    let labelTop = ["First message sent", "Error Control Code", "Encrypted", "Final message sent"];
    let labelBottom = ["First message received", "Error Control Code", "Encrypted", "Final message received"];

    textSize(16  * windowWidth/ 1300);
    textStyle(NORMAL);

    for (let i = 0; i < columnCount; i++) {
        let x = startX + i * (boxW + gap);
        let yTop = inputBoxY;
        let yBottom = windowHeight / 1.9;

        // Top Box
        fill(131, 163, 163);
        rect(x, yTop, boxW, boxH, 30);

        fill(255);
        rect(x + 10 * windowWidth * 0.0009, yTop + windowHeight * 0.12, boxW * 0.88, boxH * 0.6);

        textAlign(CENTER, CENTER);
        fill(255);
        textSize(16 * windowWidth/ 1300);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(labelTop[i], x + boxW / 2, yTop + windowHeight * 0.06);

        // Bottom Box
        fill(131, 163, 163);
        rect(x, yBottom, boxW, boxH, 30);

        fill(255);
        rect(x + 10 * windowWidth * 0.0009, yBottom + windowHeight * 0.12, boxW * 0.88,  boxH * 0.6);

        fill(255);
        textSize(16 * windowWidth/ 1300 );
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(labelBottom[i], x + boxW / 2, yBottom + windowHeight * 0.06);
    }

    //SentMessages
    textStyle(NORMAL);
    textAlign(LEFT);
    fill(0);
    textSize(12 * windowWidth / 1300);
    text(String(sentMessage), inputBoxX + inputBoxW * 1.22, inputBoxY + windowHeight * 0.23,150);
      
    //ECC sent
    push()
    textWrap(CHAR)
    textSize(8 * windowWidth / 1300)
    text(String(binaryMessage), inputBoxX + inputBoxW * 2.06, inputBoxY + windowHeight * 0.23, 100);
    pop()

    //Encrypted
    push()
    textWrap(CHAR)
    textSize(8 * windowWidth / 1300)
    text(String(sentEncryptedMessages), inputBoxX + inputBoxW * 2.92, inputBoxY + windowHeight * 0.23, 150);   
    pop()

    //RecievedMessages
    text(String(recievedMessages), inputBoxX + inputBoxW * 1.22, inputBoxY + windowHeight *0.70, 100); 

    //ECC recieved
    text(String(hammingDecoded), inputBoxX + inputBoxW * 2.06, inputBoxY + windowHeight * 0.70, 100);

    //recievedEncryptionMessages
    push()
    textWrap(CHAR)
    textSize(8 * windowWidth / 1300)
    text(String(recievedEncryptionMessages), inputBoxX + inputBoxW * 2.92, inputBoxY + windowHeight * 0.70, 100 ); 
    pop()
}
