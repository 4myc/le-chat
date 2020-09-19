// Emit form inputs (e.g. sending a message) to server and add to the DOM
const chatForm = document.getElementById('chat-form');

// Select a message
const chatMessages = document.querySelector('.chat-messages');

// Select room name
const roomName = document.getElementById('room-name');

// Select users
const userList = document.getElementById('users');


// Get username and room from URL using qs library 
// https://cdnjs.com/libraries/qs
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// console.log(username, room);

// Connect to socket.io in server
const socket = io();

// Join chat room --> Emits an event to the server
socket.emit('joinRoom', { username, room });

// Get users and room info
socket.on('roomUsers', ({ room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Show message from the server associated with each action (e.g. welcome user, new user joined, user left, etc.)
socket.on('message', message => {
    // console.log(message);

    // Output Options: templating engines (handlebars.js, mustache), React
    outputMessage(message);

    // Automatically scroll down to show latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submit a message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent page refresh

    // Get message text
    const msg = e.target.elements.msg.value;
    // console.log(msg);

    // Emit message text to the server
    socket.emit('chatMessage', msg);

    // Clear message input field after submission and focus on it
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to the DOM
function outputMessage(message) {
    // Create a new div for the message
    const div = document.createElement('div');

    // Add message to the new div
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    // Append message to the DOM
    document.querySelector('.chat-messages').appendChild(div);
};

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
};

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};