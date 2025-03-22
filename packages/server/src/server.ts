import { WebSocketServer } from 'ws';
import { createServer, IncomingMessage } from 'http';
import { a } from './state.js';

const getBody = async (req: IncomingMessage) => {
    const parts: string[] = [];

    req.on('data', chunk => {
        parts.push(chunk);
    });

    await new Promise(resolve => req.on('end', resolve));

    return JSON.parse(parts.join(''));
};

import http from './http.js';
const server = createServer(async (req, res) => {
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
});
http(server);

import socket from './socket.js';
const wss = new WebSocketServer({ server });
socket(wss);

server.listen(8080);