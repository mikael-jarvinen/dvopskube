const http = require('http');

const crypto = require('crypto');

let randomString = (new Date()).toISOString();

function logStringLoop() {
    console.log(`${(new Date()).toISOString()}: ${randomString}`);
    setTimeout(logStringLoop, 5000);
}

randomString = crypto.createHash('md5').update(randomString).digest('hex');

logStringLoop();

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${(new Date()).toISOString()}: ${randomString}`);
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
});
