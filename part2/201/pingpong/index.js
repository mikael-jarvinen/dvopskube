const http = require('http');

let counter = 0;

const server = http.createServer((req, res) => {
    if (req.url !== '/counter') {
        counter++;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`pong ${counter}`);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(counter.toString());
    }
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);
