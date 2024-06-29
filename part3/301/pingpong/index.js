const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const server = http.createServer(async (req, res) => {
    if (req.url !== '/counter') {
        await prisma.ping.create();

        const counter = await prisma.ping.count();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`pong ${counter}`);
    } else {
        const counter = await prisma.ping.count();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(counter.toString());
    }
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);
