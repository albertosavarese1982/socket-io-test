import cluster, { workers } from 'cluster';
import { Socket } from 'socket.io';

const currentConnections = new Map<string, number>();
const namespacesList = new Map<string, Set<number>>();

export default (sizeOfRooms: number) => {

    // Receives socket id when it connects to any worker
    cluster.on('message', (worker, message) => {
        if (message.cmd && message.cmd === 'addConnection') {
            const socketId = message.socketId;

            // Get connection by process
            currentConnections.set(socketId, worker.id);

            // Redirects every socket to a namespace if connections size excedes 3
            if (currentConnections.size >= sizeOfRooms) {
                const namespace = `namespace-${namespacesList.size + 1}`;
                const workersIds = new Set<number>();

                currentConnections.forEach((workerId, socket) => {
                    // Change namespace to every socket
                    const connWorker = cluster.workers[workerId];

                    if (connWorker) {
                        connWorker.send({
                            cmd: 'changeNamespace',
                            socket: socket,
                            namespace: namespace
                        });
                    }

                    // Save the namespace just created
                    workersIds.add(workerId);
                });

                namespacesList.set(namespace, workersIds);
                currentConnections.clear();
            }
        }
    })

}