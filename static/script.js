const socket = io();
let username = ""; // Variable to store the username

// Prompt the user for their username when the page loads
document.addEventListener('DOMContentLoaded', () => {
    username = prompt("Enter your username:").trim();
    if (!username) {
        username = "Anonymous"; // Default username if none is provided
    }
});

// Get the message input and send button elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');
const typingIndicator = document.getElementById('typing-indicator'); // Element to show typing

// Function to send the message
const sendMessage = () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('message', { message, username });
        messageInput.value = ''; // Clear input field
        socket.emit('typing', { username, typing: false }); // Stop typing indicator
    }
};

socket.on('typing', (data) => {
    if (data.typing) {
        typingIndicator.innerText = `${data.username} is typing...`;
    } else {
        typingIndicator.innerText = ''; // Hide typing indicator
    }
});

// Add event listener for Send button click
sendButton.addEventListener('click', sendMessage);

// Add event listener for Enter key press
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    } else {
        // Emit typing event when user types
        socket.emit('typing', { username, typing: true });
    }
});

// Listen for messages from the server
socket.on('message', (data) => {
    const { username: sender, message } = data;

    // Create the message div element
    const messageDiv = document.createElement('div');
    const isSentByUser = sender === username;

    messageDiv.classList.add('message', isSentByUser ? 'sent' : 'received'); // Add user-specific class

    // Add username and message text
    messageDiv.innerHTML = `
        <div class="username">${sender}</div>
        <div class="message">${message}</div>
        <div class="timestamp">${new Date().toLocaleTimeString()}</div>
    `;

    // Append the message to the chat box
    chatBox.appendChild(messageDiv);

    // Scroll to the bottom of the chat
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Listen for typing event from other users
socket.on('typing', (data) => {
    if (data.typing) {
        typingIndicator.innerText = `${data.username} is typing...`;
    } else {
        typingIndicator.innerText = ''; // Hide typing indicator when typing stops
    }
});

