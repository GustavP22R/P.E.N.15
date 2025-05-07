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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setupFrontEnd(); // Recalculate sizes/positions
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

    // Optional: Add outlines or hover effects here if needed
}
