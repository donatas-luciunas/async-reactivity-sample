import { WebSocketServer } from 'ws';
import { Connection } from 'async-reactivity-net';
import { SocketSampleLiveQuery } from '@async-reactivity-sample/business-logic';

export default (wss: WebSocketServer) => {
    wss.on('connection', (ws) => {
        new Connection(ws, [SocketSampleLiveQuery]);
    });
};