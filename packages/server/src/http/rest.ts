import { Server } from "http";
import { Data } from '@async-reactivity-sample/business-logic';
import { getBody } from "./utils.js";

export default (server: Server) => {
    server.on('request', async (req, res) => {
        const url = new URL(req.url ?? '', 'http://localhost:8080');

        if (req.method === 'GET' && url.pathname === '/items') {
            if (!url.searchParams.get('token')) {
                res.writeHead(401);
                res.end();
                return;
            }

            const filters = {
                done: url.searchParams.get('done') !== null ? url.searchParams.get('done') === 'true' : null,
                text: url.searchParams.get('text')
            };

            const items = await Data.get();
            const result = items.filter(i =>
                (filters.done === null || i.done === filters.done)
                && (!filters.text || i.text.includes(filters.text))
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        }

        if (req.method === 'PATCH' && url.pathname.startsWith('/items/')) {
            const id = url.pathname.replace('/items/', '');
            const body = await getBody(req);

            const items = await Data.get();
            const item = items.find(i => i.id === id);
            if (!item) {
                res.writeHead(404);
                res.end();
                return;
            }

            for (const [prop, value] of Object.entries(body)) {
                // @ts-expect-error
                item[prop] = value;
            }
            
            Data.write();

            res.writeHead(204);
            res.end();
        }

        if (req.method === 'DELETE' && url.pathname.startsWith('/items')) {
            const id = url.pathname.replace('/items/', '');
            
            const items = await Data.get();
            const index = items.findIndex(i => i.id === id);
            if (index === -1) {
                res.writeHead(404);
                res.end();
                return;
            }
            items.splice(index, 1);

            Data.write();

            res.writeHead(204);
            res.end();
        }
    });
};