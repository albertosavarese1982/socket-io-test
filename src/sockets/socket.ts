import ioBuilder = require('socket.io');

import crypter from '../util/crypter';
import redisAdapter from 'socket.io-redis';
import { Server } from 'http';
import { NamespaceInstance } from '../entities/namespaceInstance';

export default (server: Server, sizeOfRooms: number) => {
    const io = ioBuilder(server);
    const redisEndPoint = process.env.REDIS_URL;

    if (redisEndPoint) {
        io.adapter(redisAdapter(redisEndPoint));
    } else {
        console.log("Error while connecting to redis!")
    }

    io.of('/main-room').on('connection', (socket) => {

        console.log(`SOCKET ${socket.id} CONNECTED IN THE MAIN ROOM OF ${process.pid} PROCESS`);
        if (process.send) {
            process.send({
                cmd: 'addConnection',
                socketId: socket.id
            })
        }

        socket.emit('connection', {
            room: 'MAIN ROOM'
        })

        socket.on('disconnect', () => {
            console.log(socket.id + ' disconnected from MAIN ROOM');
        })
    })

    process.on('message', (message) => {
        if (message.cmd && message.cmd === 'changeNamespace') {
            if (typeof io.nsps[`/${message.namespace}`] === 'undefined') {
                generateNamespace(io, message.namespace, sizeOfRooms);
            }
            io.of('/main-room').to(message.socket).emit('change-namespace', {
                namespace: message.namespace
            })
        }
    })
}

const generateNamespace = (io: ioBuilder.Server, name: string, sizeOfRooms: number) => {
    const namespaceInstance = new NamespaceInstance(io, name, sizeOfRooms);

    return namespaceInstance;
}


