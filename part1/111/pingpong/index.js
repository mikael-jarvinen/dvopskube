const http = require('http');
const fs = require('fs');

let counter = 0;

const server = http.createServer((req, res) => {
    counter++;

    fs.writeFileSync(
        '/tmp/counter.txt',
        counter.toString(),
        { flag: 'w+' }
    );

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`pong ${counter}`);
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);
