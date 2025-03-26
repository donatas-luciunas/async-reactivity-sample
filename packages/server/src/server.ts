import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { a } from './state.js';

import { cors, getBody } from './http/utils.js';
import httpQuery from './http/query.js';
const server = createServer(async (req, res) => {
    cors(req, res);

    if (req.method === "PUT") {
        const body = await getBody(req);
        a.value = body.input;
        console.log(`a = ${body.input}`);
        res.writeHead(204);
        res.end();
        return;
    }
});
httpQuery(server);

import socket from './socket.js';
const wss = new WebSocketServer({ server });
socket(wss);

server.listen(8080);