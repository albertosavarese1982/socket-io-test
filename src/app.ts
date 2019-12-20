import express = require('express');
import dotenv = require('dotenv');
import http = require('http');
import sticky = require('sticky-session');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

import socket from './sockets/socket';
import memoryManager from './memory/sharedMemoryHandler';

const sizeOfRooms = 3;

dotenv.config();

const app = express();
const server = http.createServer(app);

const port = process.env.PORT as string;

if (!sticky.listen(server, +port, { workers: numCPUs })) {
    // Master
    server.once('listening', () => {
        console.log('APP LISTENING ON PORT 3000');
    })

    memoryManager(sizeOfRooms);
} else {
    // Worker
    console.log('worker run')
    socket(server, sizeOfRooms);
}

/* 
Impossibile passare un socket da un processo ad un altro, almeno non con socket io visto che il processo verrà sempre
deciso dall'indirizzo ip dell'utente. Ci sono due soluzioni:
-Sharing di eventi socket-io tramite socket.io-adapter con memored (così da evitare redis)
-Passaggio ai websocket che non hanno il problema del longpolling
*/
