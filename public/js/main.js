// Emit form inputs (e.g. sending a message) to server and add to the DOM
const chatForm = document.getElementById('chat-form');

// Select a message
const chatMessages = document.querySelector('.chat-messages');

// Connect to socket.io in server
const socket = io();

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

    // Emit message to the server
    socket.emit('chatMessage', msg);

    // Clear the message input field after submission and focus on it
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to the DOM
function outputMessage(message) {
    // Create a new div for the message
    const div = document.createElement('div');

    // Add the message to the new div
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Amy <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;

    // Append the message to the DOM
    document.querySelector('.chat-messages').appendChild(div);
};