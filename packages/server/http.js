import { a } from './state.js';
import query from './query.js';

const getBody = async (req) => {
    const parts = [];

    req.on('data', chunk => {
        parts.push(chunk);
    });

    await new Promise(resolve => req.on('end', resolve));

    return JSON.parse(parts.join(''));
};

export default (server) => {
    server.on('request', async (req, res) => {
        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Handle preflight request (OPTIONS)
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.method === "PUT") {
            const body = await getBody(req);
            a.value = body.input;
            console.log(`a = ${body.input}`);
            res.writeHead(204);
            res.end();
            return;
        }

        const url = new URL(req.url, 'http://localhost:8080');

        if (req.method === "GET" && url.pathname === '/') {
            const i = url.searchParams.get('invert') === 'true'
            console.log(`http | get (invert=${i})`);
            const { invert, b } = query();
            invert.value = i;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                b: b.value
            }));
            return;
        }

        res.writeHead(404);
        res.end();
    });
};