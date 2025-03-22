import { Ref, Computed } from 'async-reactivity';

export const a = new Ref(5);

export const b = new Computed(value => {
    const result = value(a) % 5 === 0;
    console.log(`b: ${result}`);
    return result;
});