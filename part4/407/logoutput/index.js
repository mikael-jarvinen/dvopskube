const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

const pingpongUrl = process.env.PINGPONG_URL || 'http://localhost:3001/counter';

let randomString = (new Date()).toISOString();

function logStringLoop() {
    console.log(`${(new Date()).toISOString()}: ${randomString}`);
    setTimeout(logStringLoop, 5000);
}

randomString = crypto.createHash('md5').update(randomString).digest('hex');

logStringLoop();

// Get string content of /etc/config/information.txt
function getInformationText() {
    const path = '/etc/config/information.txt';
    try {
        const content = fs.readFileSync(path, { encoding: 'utf8' });

        console.log(`Read content from ${path}: ${content}`);

        return content;
    } catch (err) {
        console.error(`Error reading file ${path}: ${err}`);
    }
}

const fileContent = getInformationText();

const server = http.createServer(async (req, res) => {
    try {
        const pingpongResponse = await fetch(pingpongUrl);
        const counter = await pingpongResponse.text();

        res.writeHead(200, { 'Content-Type': 'text/plain' });

        let output = `file content: ${fileContent}.\n`;
        output += `env variable: MESSAGE=${process.env.MESSAGE}.\n`;
        output += `${(new Date()).toISOString()}: ${randomString}.\n`;
        output += `Ping / Pongs: ${counter}.\nTest edit new`;

        res.end(output);
    } catch (e) {
        console.error(`Error: ${e}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
    }
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);
