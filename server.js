var express= require('express');
var app=express();
var server= require('http').createServer(app);

var io= require('socket.io').listen(server);


users=[];
connections=[];
server.listen(process.env.PORT || 3000);

app.get('/',function (req,res) {
    console.log("running...");
         res.sendFile(__dirname+ '/index.html');
});

io.sockets.on('connection', function (socket){
   connections.push(socket);
   console.log('connected: %s connections are connected', connections.length);

   //discntd
    socket.on('disconnect', function (data) {


        users.splice(users.indexOf(socket.username),1 );
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('disconnected: %s connections are connected', connections.length);
    });

    socket.on('send message', function(data){

        console.log(data);
        io.sockets.emit('new message', {msg:data, user: socket.username});
    });

    socket.on('new user', function(data, callback){

        callback(true);
        socket.username=data;
        users.push(socket.username);
        updateUserNames();

    });

    function updateUserNames() {

        io.sockets.emit('get user', users);

    }

});
