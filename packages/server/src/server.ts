import { WebSocketServer } from 'ws';
import { createServer } from 'http';

import { cors } from './http/utils.js';
import httpQuery from './http/query.js';
import httpRest from './http/rest.js';
const server = createServer(cors);
httpQuery(server);
httpRest(server);

import socket from './socket.js';
const wss = new WebSocketServer({ server });
socket(wss);

server.listen(8080);

import './monitors.js';