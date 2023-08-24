import express from 'express';
import http from 'http';
import { Server, type Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Define data type for safety
interface Data {
	content1: any;
	content2: any;
	content3: any;
}

// Connection listener for incoming sockets
io.on('connection', (socket: Socket) => {
	console.log('a user connected:', socket.id);

	// Listen to 'state change' event from clients
	socket.on('state_change', (data: Data) => {
		console.log('State Change Received:', data);

		// Broadcast the data to other clients except the sender
		socket.broadcast.emit('new_state', data);
	});
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
