import http from 'http';

const PORT = 3000;

function fibonacci(n) {
    if (n < 2) {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}

http.createServer((req, res) => {
    const result = fibonacci(30);
    res.end(`[Process #${process.pid}] result: ${result}`);
}).listen(PORT, () => {
    console.log(`Process #${process.pid} is listening on port ${PORT}`);
});

process.on('message', ({ message }) => {
    console.log(`A message from the boss: ${message}`);
});

// random crash
setTimeout(() => {
    process.exit(1);
}, Math.random() * 4000);
