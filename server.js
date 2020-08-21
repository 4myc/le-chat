const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const adminName = 'Admin Bot';

// Communicating with the front end:
// socket.emit - emits to a single user
// socket.broadcast.emit - emits to all other users except sender
// socket.on - listens and receives action from one user
// io.emit - emits a message to all users 

// Create a connection - Run when a user connects
io.on('connection', socket => {
    // console.log('New WS Connection...');

    // Welcome new user --> Emits to a SINGLE client
    socket.emit('message', formatMessage(adminName,'Welcome to Le Chat!'));

    // Announce when a new user connects --> Emits to all clients EXCEPT the client that is connecting
    socket.broadcast.emit('message', formatMessage(adminName,'A user has joined the chat'));

    // Run when a user disconnects (needs to be inside socket 'io.on('connection') --> Emits to ALL clients
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(adminName,'A user has left the chat'));
    });

    // Listen for chatMessage from the user & catch the emitted message from the front end (main.js)
    socket.on('chatMessage', (msg) => {
        // console.log(msg);
        
        // Emit message back to the front end
        // io.emit('message', msg);
        io.emit('message', formatMessage('USER', msg));
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));