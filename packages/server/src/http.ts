import { Server } from 'http';
import { Ref, Computed } from 'async-reactivity';
import { SampleQuery as BaseSampleQuery } from '@async-reactivity-sample/business-logic';
import { b } from './state.js';

class SampleQuery extends BaseSampleQuery {
    public readonly invert: Ref<Promise<boolean>>;
    public readonly b: Computed<Promise<boolean>>;

    constructor() {
        super();

        this.invert = new Ref(Promise.resolve(false));

        this.b = this.register(new Computed(async value => {
            const i = await value(this.invert);
            if (i) {
                return !value(b);
            }
            return value(b);
        }));
    }
}

export default (server: Server) => {
    server.on('request', async (req, res) => {
        const url = new URL(req.url!, 'http://localhost:8080');

        if (req.method === "GET" && url.pathname === '/') {
            const i = url.searchParams.get('invert') === 'true'
            console.log(`http | get (invert=${i})`);
            
            const query = new SampleQuery(); // use using
            query.invert.value = Promise.resolve(i);
            const result = await query.b.value;
            query[Symbol.dispose]();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                b: result
            }));
        }
    });
};