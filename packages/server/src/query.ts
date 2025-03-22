import { Ref, Computed } from 'async-reactivity';
import * as state from './state.js';

export default () => {
    const invert = new Ref(false);

    const b = new Computed(value => {
        const i = value(invert);
        if (i) {
            return !value(state.b);
        }
        return value(state.b);
    });

    return {
        invert,
        b
    };
};