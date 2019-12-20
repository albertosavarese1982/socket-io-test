import { Namespace, Server, Socket } from "socket.io";
import { isObject } from "util";

export class NamespaceInstance {
    name: string;
    namespace: Namespace | null;
    remaining: number;

    constructor(io: Server, namespaceName: string, namespaceSize: number) {
        this.name = namespaceName,
        this.remaining = namespaceSize,
        this.namespace = this._generateSocket(io)
    }



    _reduceRemaining = () => {
        this.remaining--;
    }

    _increaseRemaining = (io: Server) => {
        this.remaining++;
    }

    _generateSocket = (io: Server) => {
        return io.of(`/${this.name}`).on('connection', (socket) => {
            
            this._reduceRemaining();

            socket.emit('start');

            socket.on('position', (values) => {

                socket.broadcast.emit('opponent-position', values);
            })

            socket.on('disconnect', () => {
                console.log(`${socket.id} disconnected from ${this.name}`);
                this._increaseRemaining(io);
            })
        })
    }
}