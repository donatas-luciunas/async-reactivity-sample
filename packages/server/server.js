import { WebSocketServer } from 'ws';
import { createServer } from 'http';

import httpApi from './http.js';
const server = createServer();
httpApi(server);

import socketApi from './socket.js';
const wss = new WebSocketServer({ server });
socketApi(wss);

server.listen(8080);