function fibonacci(n) {
    if (n < 2) {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}

process.on('message', (message) => {
    process.send({
        result: fibonacci(message.fibonacci),
    });
    process.exit(0);
});
