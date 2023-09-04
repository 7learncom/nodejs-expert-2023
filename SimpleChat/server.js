import { Server } from 'socket.io';
import { EVENT_INFO } from './constants.js';

const io = new Server(3000);

console.log('Server is started...');

io.on('connection', (socket) => {
    console.log('A client has been connected');

    socket.emit(EVENT_INFO, 'Welcome to SimpleChat');
});
