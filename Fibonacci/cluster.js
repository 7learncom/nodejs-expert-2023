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
}

main();
