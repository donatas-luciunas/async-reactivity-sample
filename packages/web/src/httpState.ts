import { Computed } from 'async-reactivity';
import { invert } from './query.js';

export const b = new Computed(async value => {
    const i = value(invert);
    const response = await fetch(`http://localhost:8080?invert=${i}`);
    const body = await response.json();
    console.log('http | set', body.b);
    return body.b;
});