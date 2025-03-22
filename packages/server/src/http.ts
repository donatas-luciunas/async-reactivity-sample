import { Server } from 'http';
import { Ref, Computed } from 'async-reactivity';
import { b } from './state.js';

class SampleQuery {
    public readonly invert: Ref<boolean>;
    public readonly b: Computed<boolean>;

    constructor() {
        this.invert = new Ref(false);

        this.b = new Computed(value => {
            const i = value(this.invert);
            if (i) {
                return !value(b);
            }
            return value(b);
        });
    }
}

export default (server: Server) => {
    server.on('request', async (req, res) => {
        const url = new URL(req.url!, 'http://localhost:8080');

        if (req.method === "GET" && url.pathname === '/') {
            const i = url.searchParams.get('invert') === 'true'
            console.log(`http | get (invert=${i})`);
            
            const query = new SampleQuery();
            query.invert.value = i;
            const result = query.b.value;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                b: result
            }));
        }
    });
};