import { Computed } from 'async-reactivity';

export const b = new Computed(async () => {
    const response = await fetch('http://localhost:8080');
    const body = await response.json();
    console.log('http | set', body.b);
    return body.b;
});