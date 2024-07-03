const http = require('http');
const { PrismaClient } = require('@prisma/client');
const subProcess = require('child_process');
const { connect, StringCodec } = require('nats');

const prisma = new PrismaClient();

let pushed = false;
let connected = false;

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
let nc;

const stringCodec = StringCodec();

const server = http.createServer(async (req, res) => {
    if (req.url.includes('/todos/') && req.method === 'PUT') {
        const id = req.url.split('/')[2];

        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Bad Request' }));
            return;
        }

        const updatedTodo = await prisma.todo.update({
            where: {
                id: parseInt(id),
            },
            data: {
                completed: true,
            },
        });

        nc.publish('todos', stringCodec.encode(`Completed todo: ${updatedTodo.title}`));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: updatedTodo }));
    } else if (req.url === '/healthcheck') {
        if (!connected) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'NATS not connected' }));
            return;
        }

        try {
            await prisma.$connect();

            // Push schema to DB
            if (!pushed) {
                subProcess.execSync('npx prisma db push');
                pushed = true;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'OK' }));
        } catch (e) {
            console.error(e);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    } else if (req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            const title = JSON.parse(body).data;
            
            await prisma.todo.create({
                data: {
                    title,
                },
            });

            const todos = (await prisma.todo.findMany({ select: { title: true } })).map((t) => t.title);

            console.log(`Added new todo: ${title}`);
            nc.publish('todos', stringCodec.encode(`Created todo: ${title}`));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data: todos }));
        });
    } else {
        const todos = (await prisma.todo.findMany({ select: { title: true } })).map((t) => t.title);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: todos }));
    }
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);

// Loop to connect to NATS
const connectToNats = async () => {
    try {
        console.log(`Connecting to NATS: ${NATS_URL}`)

        nc = await connect({ servers: NATS_URL });
        connected = true;

        console.log(`Connected to NATS: ${NATS_URL}`);
    } catch (e) {
        console.error(e);
        setTimeout(connectToNats, 5000);
    }
};

connectToNats();
