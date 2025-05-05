function setupFrontEnd() {
    let inputWidth = windowWidth * 0.2;
    let inputHeight = windowHeight * 0.2;
    let inputX = windowWidth * 0.05;
    let inputY = windowHeight * 0.18;

    messageInput = createElement('textarea');
    messageInput.attribute('placeholder', 'Message here');
    messageInput.position(inputX, inputY);
    messageInput.size(inputWidth, inputHeight);

    let buttonWidth = 120;
    let buttonHeight = 25;

    xSend = inputX * 3.2; // same as input X
    ySend = inputY - inputHeight * 0.5;

    messageSend = createButton("Send message");
    messageSend.position(xSend, ySend);
    messageSend.size(buttonWidth, buttonHeight);
    messageSend.mousePressed(sendData);

    NewMessage = createButton("New Message");
    NewMessage.position(xSend, ySend + buttonHeight + 5);
    NewMessage.size(buttonWidth, buttonHeight);
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
    rect(20, 15, windowWidth - 70, windowHeight - 58, 30);

    fill(3, 54, 73);
    rect(20, windowHeight / 2 - 15, windowWidth - 70, windowHeight / 2 - 28, 0, 0, 30, 30);

    // Input Box (Left)
    let inputBoxX = windowWidth * 0.05;
    let inputBoxY = 25;
    let inputBoxW = windowWidth * 0.2;
    let inputBoxH = windowHeight * 0.35;

    fill(131, 163, 163);
    rect(inputBoxX - 20, inputBoxY, inputBoxW + 30, inputBoxH, 30);

    fill(255);
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("Send message\nbelow", inputBoxX + inputBoxW / 4, inputBoxY + 40);

    fill(131, 163, 163);
    rect(inputBoxX - 20, inputBoxY * 13.28, inputBoxW + 30, inputBoxH, 30);

    // Dynamic Message Boxes
    let columnCount = 4;
    let boxW = windowWidth * 0.15;
    let boxH = inputBoxH;
    let gap = windowWidth * 0.02;
    let startX = inputBoxX + inputBoxW + gap * 1.5;

    let labelTop = ["First message sent", "Error Control Code", "Encrypted", "Final message sent"];
    let labelBottom = ["First message received", "Error Control Code", "Encrypted", "Final message received"];

    textSize(14);
    textStyle(NORMAL);

    for (let i = 0; i < columnCount; i++) {
        let x = startX + i * (boxW + gap);
        let yTop = inputBoxY;
        let yBottom = windowHeight / 1.9;

        // Top Box
        fill(131, 163, 163);
        rect(x, yTop, boxW, boxH, 30);

        fill(255);
        rect(x + 12, yTop + 80, boxW - 25, boxH - 90);

        
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(16);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(labelTop[i], x + boxW / 2, yTop + 30);

        // Bottom Box
        fill(131, 163, 163);
        rect(x, yBottom, boxW, boxH, 30);

        fill(255);
        rect(x + 12, yBottom + 80, boxW - 25, boxH - 90);

        fill(255);
        textSize(16);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(labelBottom[i], x + boxW / 2, yBottom + 30);
    }

    // Optional: Add outlines or hover effects here if needed
}
