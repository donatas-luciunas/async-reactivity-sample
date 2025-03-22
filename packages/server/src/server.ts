import { WebSocketServer } from 'ws';
import { createServer } from 'http';

import http from './http.js';
const server = createServer();
http(server);

import socket from './socket.js';
const wss = new WebSocketServer({ server });
socket(wss);

server.listen(8080);