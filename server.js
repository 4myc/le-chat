const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const adminName = 'Admin';

// https://github.com/socketio/socket.io-website/blob/master/source/docs/emit-cheatsheet.md

// Communicating with the front end:
// socket.emit - emits to a single user
// socket.broadcast.emit - emits to all other users except sender
// socket.on - listens and receives action from one user
// io.emit - emits a message to all users 

// Create a connection
io.on('connection', socket => {
    // console.log('New WS Connection...');

    // Run when a user connects
    socket.on('joinRoom', ({ username, room }) => {
        // Set user with info
        const user = userJoin(socket.id, username, room);
        // New user joins room
        socket.join(user.room);

        // Moved here from outside
        // Welcome new user --> Emits to a SINGLE client
        socket.emit('message', formatMessage(adminName,`Hi ${user.username}. Welcome to Le Chat!`));

        // Announce when a new user connects --> Emits to all clients EXCEPT the client that is connecting
        // .to(user.room) --> broadcasts message ONLY to the user's room
        socket.broadcast.to(user.room).emit('message', formatMessage(adminName,`${user.username} has joined the chat.`));

        // Send users and room info to front end - copy to disconnect
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    // Listen for chatMessage from the user & catch the emitted message from the front end (main.js)
    socket.on('chatMessage', (msg) => {
        // console.log(msg);

        // Set user with id
        const user = getCurrentUser(socket.id);
        
        // Emit message back to the front end
        // io.emit('message', msg);
        // .to(user.room) --> broadcasts message ONLY to the user's room
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Run when a user disconnects (needs to be inside socket 'io.on('connection') --> Emits to ALL clients
    socket.on('disconnect', () => {
        // Set user with id
        const user = userLeave(socket.id);

        // Check if user exists
        if(user) {
            io.to(user.room).emit('message', formatMessage(adminName, `${user.username} has left the chat.`));

            // Remove users and room info when users disconnect
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));