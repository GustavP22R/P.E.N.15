function setupFrontEnd ()
{
    messageInput = createElement('textarea')
    messageInput.attribute('placeholder','Message here')
    messageInput.position(xInput , yInput)
    messageInput.size(280,160);

    messageSend = createButton("Send message")
    messageSend.position(xSend, ySend)
    messageSend.mousePressed(sendData)


    NewMessage = createButton("New Message")
    NewMessage.position(xSend, ySend + 30)
    NewMessage.mousePressed(messageSend.value = "")
    NewMessage.size(105, 20);
}

function drawFrontEnd () //has same function as the "draw()" function, but exists to make sketch.js more readable
{
    fill(3, 101, 100);
    rect(20, 15, windowWidth - 70, windowHeight - 58, 30);
    fill(3, 54, 73)
    rect(20, windowHeight/2 - 15, windowWidth - 70, windowHeight/2 - 28, 0,0,30,30);

    //Boxes
    fill(131, 163, 163)
    rect(xInput - 20, 25,310,260,30);
    fill(255)
    textSize(16);
    textStyle(BOLD)
    text("Send message\nbelow",120,60)

    for(var i = 1; i < 5; i++)
        {
        fill(131, 163, 163)
        rect((xInput + 75) + 220 * i, 25,215,260,30);
        fill(0)
        textSize(16);
        fill(131, 163, 163)
        rect((xInput + 75) + 220 * i, windowHeight/2,215,260,30);

        fill(255);
        rect(xInput + 87 + 220 * i, 104,190,160)
        rect(xInput + 87 + 220 * i, windowHeight/2 + 80, 190, 160)
        }

    fill(131, 163, 163)
    rect(xInput - 20, windowHeight/2,310,260,30);

    fill(255);
    textAlign(CENTER)
    text("First message sent",230 + 220 * 1,70)
    text("Error Control Code",230 + 220 * 2,70)
    text("Encrypted",230 + 220 * 3,70)
    text("Final message sent",230 + 220 * 4,70)

    text("First message recieved",230 + 220 * 1,360)
    text("Error Control Code",230 + 220 * 2,360)
    text("Encrypted",230 + 220 * 3,360)
    text("Final message recieved",230 + 220 * 4,360)
   
}