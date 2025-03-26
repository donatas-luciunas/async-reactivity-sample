import { Server } from 'http';
import { FetchResponder } from 'async-reactivity-net';
import { HttpSampleQuery } from '@async-reactivity-sample/business-logic';
import { getBody } from './utils.js';

export default (server: Server) => {
    const responder = new FetchResponder([HttpSampleQuery]);

    server.on('request', async (req, res) => {
        if (req.method === "POST" && req.url === '/query') {
            const body = await getBody(req);
            const result = await responder.run(body);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        }
    });
};