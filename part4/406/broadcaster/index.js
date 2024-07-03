const http = require('http');
const { connect, StringCodec } = require('nats');

let connected = false;

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
let nc;

const stringCodec = StringCodec();

const server = http.createServer(async (req, res) => {
    if (req.url === '/healthcheck') {
        if (connected) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'OK' }));
            return;
        } else {

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
            return;
        }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'OK' }));
    return;
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

        const todosSub = nc.subscribe('todos');

        // Handle messages from subscription
        (async () => {
            console.log('listening for messages');
            for await (const m of todosSub) {
                console.log(`Received message: ${stringCodec.decode(m.data)}`);
                
                if (process.env.BROADCAST_URL) {
                    await fetch(process.env.BROADCAST_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user: 'bot',
                            message: stringCodec.decode(m.data) 
                        }),
                    });
                }
            }
            console.log("subscription closed");
        })();
    } catch (e) {
        console.error(e);
        setTimeout(connectToNats, 5000);
    }
};

connectToNats();
