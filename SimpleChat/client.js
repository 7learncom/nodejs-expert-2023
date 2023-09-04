import { io } from "socket.io-client";
import { EVENT_INFO } from "./constants.js";

const socket = io('ws://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to the server.');
});

socket.on(EVENT_INFO, (message) => {
    console.log('[Server Info]:', message);
});
