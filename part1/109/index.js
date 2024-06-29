const http = require('http');

let counter = 0;

const server = http.createServer((req, res) => {
    res.end(`pong ${counter++}`);
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);
