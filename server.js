const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects --> To a single client
io.on('connection', socket => {
    // console.log('New WS Connection...');

    // Welcome new user
    socket.emit('message', 'Welcome to Le Chat!');

    // Announce when a new user connects --> To all clients EXCEPT client that is connecting
    socket.broadcast.emit('message', 'A user has joined the chat room');

    // Run when a client disconnects --> To ALL clients
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat room');
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));