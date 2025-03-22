import { Ref, Computed } from 'async-reactivity';

export const a = new Ref(5);

export const b = new Computed(value => {
    const result = value(a) % 5 === 0;
    console.log('compute', result);
    return result;
});

setInterval(() => {
    a.value = a.value + 1;
    console.log(a.value);
}, 1000);