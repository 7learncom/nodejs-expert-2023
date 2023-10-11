import cluster from 'cluster';
import os from 'os';

function main() {
    if (cluster.isWorker) {
        import('./index.js');
        return;
    }

    const cpus = os.cpus().length;

    console.log(`Forking for ${cpus} CPUs`);
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    setTimeout(() => {
        Object.values(cluster.workers).forEach(worker => {
            worker.send({ message: 'Hello!' });
        });
    }, 2000);

    cluster.on('exit', (worker, code) => {
        if (code === 0 || worker.exitedAfterDisconnect) {
            return;
        }

        console.log(`Worker #${worker.id} crashed, restarting...`);
        cluster.fork();
    });
}

main();
