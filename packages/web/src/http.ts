import { Computed } from 'async-reactivity';
import { SampleQuery as BaseSampleQuery } from '@async-reactivity-sample/business-logic';
import { invert } from './query.js';

export class SampleQuery extends BaseSampleQuery {
    public readonly invert: Computed<Promise<boolean>>;
    public readonly b: Computed<Promise<boolean>>;

    constructor() {
        super();

        // this.invert = invert; could be used, but type error occurs
        this.invert = this.register(new Computed(value => Promise.resolve(value(invert))));

        this.b = new Computed(async value => {
            const i = await value(this.invert);
            const response = await fetch(`http://localhost:8080?invert=${i}`);
            const body = await response.json();
            console.log('http | set', body.b);
            return body.b;
        });
    }
}

export const query = new SampleQuery();