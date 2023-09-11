import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { io } from "socket.io-client";
import { EVENT_INFO, EVENT_MESSAGE } from "./constants.js";

function clearPrevLine() {
    output.moveCursor(0, -1);
    output.clearLine();
}

function printDivider(fullname) {
    console.log(`--- [${fullname}] ------`);
}

function setupSocket(fullname) {
    const socket = io('ws://localhost:3000');

    socket.on('connect', () => {
        clearPrevLine();
        console.log('Connected to the server.');
        printDivider(fullname);
    });

    socket.on(EVENT_INFO, (message) => {
        clearPrevLine();
        console.log('[Server Info]:', message);
        printDivider(fullname);
    });

    socket.on(EVENT_MESSAGE, ({ sender, message }) => {
        clearPrevLine();
        console.log(`[${sender}]: ${message}`);
        printDivider(fullname);
    });

    return socket;
}

async function getInput(rl, socket, sender) {
    const message = await rl.question('');

    clearPrevLine();

    socket.emit(EVENT_MESSAGE, { sender, message });

    await getInput(rl, socket, sender);
}

async function main() {
    console.log('--- SimpleChat Client ---');
    
    const rl = readline.createInterface({ input, output });
    
    const fullname = await rl.question('Fullname: ');

    const socket = setupSocket(fullname);

    getInput(rl, socket, fullname);
}

main();
