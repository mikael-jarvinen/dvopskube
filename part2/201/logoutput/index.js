const http = require('http');
const crypto = require('crypto');

const pingpongUrl = process.env.PINGPONG_URL || 'http://localhost:3001/counter';

let randomString = (new Date()).toISOString();

function logStringLoop() {
    console.log(`${(new Date()).toISOString()}: ${randomString}`);
    setTimeout(logStringLoop, 5000);
}

randomString = crypto.createHash('md5').update(randomString).digest('hex');

logStringLoop();

const server = http.createServer(async (req, res) => {
    const pingpongResponse = await fetch(pingpongUrl);
    const counter = await pingpongResponse.text();

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`${(new Date()).toISOString()}: ${randomString}.\nPing / Pongs: ${counter}`);
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);
