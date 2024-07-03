const http = require('http');
const { PrismaClient } = require('@prisma/client');
const subProcess = require('child_process');

const prisma = new PrismaClient();

let pushed = false

const server = http.createServer(async (req, res) => {
    if (req.url === '/healthcheck') {
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
