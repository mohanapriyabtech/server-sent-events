const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());

// Store connected clients
const chatMessages = [];
const clients = {};
// Store typing status
const typingStatus = {};

app.get('/events', (req, res) => {
    // Headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = uuidv4();
    clients[clientId] = res;

    res.write(`data: Welcome! Your ID is ${clientId}\n\n`);

    // Send existing chat messages to the new client
    chatMessages.forEach(message => {
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    });

    // Handle client disconnect
    req.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
        delete clients[clientId];
    });
});

// Endpoint to send chat messages
app.post('/send-message', (req, res) => {
    const { message, sender } = req.body;

    if (!message || !sender) {
        return res.status(400).json({ error: 'Message and sender are required' });
    }

    const newMessage = { id: uuidv4(), message, sender, timestamp: new Date().toISOString() };
    chatMessages.push(newMessage);

    // Send the new message to all connected clients
    sendUpdateToClients(newMessage);

    res.status(200).json({ message: 'Message sent successfully' });
});

// Endpoint to update typing status
app.post('/typing', (req, res) => {
    const { clientId, isTyping } = req.body;
    typingStatus[clientId] = isTyping;

    // Notify all connected clients about typing status change
    sendTypingStatusUpdate(clientId, isTyping);

    res.status(200).json({ message: 'Typing status updated' });
});

/**
 * Function to send updates to all connected clients.
 * @param {Object} data - The data to be sent to clients.
 */
function sendUpdateToClients(data) {
    Object.values(clients).forEach(client => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}

/**
 * Function to send typing status updates to all connected clients.
 * @param {string} clientId - The ID of the client whose typing status is updated.
 * @param {boolean} isTyping - Boolean indicating if the client is typing.
 */
function sendTypingStatusUpdate(clientId, isTyping) {
    Object.values(clients).forEach(client => {
        client.write(`data: ${JSON.stringify({ clientId, isTyping })}\n\n`);
    });
}

app.listen(port, () => {
    console.log(`Chat server listening at http://localhost:${port}`);
});
