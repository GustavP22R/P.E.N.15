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
