var express = require('express');
const { Server } = require('http');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './view');
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

var usersOnline = [];

io.on('connection', function (socket) {
    console.log('Connected person: ' + socket.id);
    socket.on('client_send_username', function (data) {
        if (usersOnline.indexOf(data) >= 0) {
            socket.emit('server_send_errorsignup', data);
        } else {
            usersOnline.push(data);
            socket.userName = data; // tạo thêm 1 thuộc tính 'username' cho socket
            io.sockets.emit('server_send_successsignup', {
                userName: data,
                id: socket.id,
            });
        }
    });

    socket.on('client_send_message', function (data) {
        io.sockets.emit('server_send_message', {
            userName: socket.userName,
            msg: data,
        });
    });

    socket.on('user_tease_user', function (data) {
        if (socket.id !== data) {
            io.to(data).emit('server_handle_tease', socket.userName);
        }
    });
});

app.get('/', function (req, res) {
    res.render('trangchu');
});
