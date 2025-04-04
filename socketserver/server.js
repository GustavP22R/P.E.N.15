var express = require('express');

var app = express();
var server = app.listen(5501);

app.use(express.static('public'));

console.log("init");

var socket = require('socket.io');

var io = socket(server);

function newConnection(socket){
    function mouseMsg(data){
        socket.broadcast.emit('mouse' , data);
        console.log(data);
    }
    
    console.log('new connection: ' + socket.id);

    socket.on('mouse' ,mouseMsg);


}

io.sockets.on('connection', newConnection);
console.log("socketOn");

