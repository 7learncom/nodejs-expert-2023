import { exec, spawn } from 'child_process';

console.log(`Process #${process.pid} is started`);

// exec
const child = exec('echo Hello from a child process', (error, stdout, stderr) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(`Child process #${child.pid}:`, stdout);
});

child.on('exit', (code) => {
    console.log(`Child process #${child.pid} is exited with code ${code}`);
});

// spawn
const child2 = spawn('pwd');

child2.stdout.on('data', (data) => {
    console.log(`Child process #${child2.pid}: ${data}`);
});

child2.on('exit', (code) => {
    console.log(`Child process #${child2.pid} is exited with code ${code}`);
});

// piping
const child3 = spawn('wc');

process.stdin.pipe(child3.stdin);
child3.stdout.pipe(process.stdout);

process.on('exit', (code) => {
    console.log(`Process #${process.pid} is exited with code ${code}`);
});
