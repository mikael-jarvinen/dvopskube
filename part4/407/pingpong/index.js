const http = require('http');
const { PrismaClient } = require('@prisma/client');
const subProcess = require('child_process');

const prisma = new PrismaClient();

let pushed = false;
let connected = false;

const server = http.createServer(async (req, res) => {
    if (req.url === '/counter') {
        const counter = await prisma.ping.count();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(counter.toString());
    } else if (req.url === '/healthcheck') {
        try {
            if (!connected) {
                await prisma.$connect();
                connected = true;
                // When the connection is successful push the DB schema
                subProcess.execSync('npx prisma db push');
                pushed = true;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('ok');
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('DB connection failed');
        }
    } else {
        await prisma.ping.create();

        const counter = await prisma.ping.count();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`pong ${counter}`);
    }
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);
