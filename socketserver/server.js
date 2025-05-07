var express = require('express');

var hostID = 3000

var app = express();
var server = app.listen(hostID);

app.use(express.static('public'));

console.log("hosting server on http://localhost:" + String(hostID) + "/");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('new connection: ' + socket.id);

    socket.on('mouse' , mouseMsg);
    socket.on('message', Msg)
    socket.broadcast.emit('user-joined', { id: socket.id });

    function mouseMsg(data){
        socket.broadcast.emit('mouse' , data);
        console.log(data);
    }
    function Msg(m){
        socket.broadcast.emit('message' , m);
        console.log(m);
    }
}