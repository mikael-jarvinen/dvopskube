const http = require('http');


let todos = [
    'TODO 1',
    'TODO 2',
];

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            todos.push(JSON.parse(body).data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data: todos }));
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: todos }));
    }
});

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Server running on port ${port}`);
