import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
	console.log('User connected');

	ws.on('message', (message) => {
		console.log('Received:', message);

		// Parse the message if it's JSON
		let data;
		try {
			data = JSON.parse(message);
		} catch (err) {
			console.error('Failed to parse message:', err);
			return;
		}

		// Check for 'state_change' event and broadcast
		if (data.action === 'state_change') {
			// Broadcast the data to other clients except the sender
			wss.clients.forEach((client) => {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(
						JSON.stringify({ event: 'new_state', ...data })
					);
				}
			});
		}
	});

	ws.on('close', () => {
		console.log('User disconnected');
	});
});

// Start the server
const PORT = 6789;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
