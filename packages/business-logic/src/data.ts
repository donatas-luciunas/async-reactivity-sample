import { Ref } from 'async-reactivity';
import { isEqual } from 'lodash';

export interface Item {
    id: string;
    text: string;
    done: boolean;
}

export const data = new Ref<Item[]>([{
    id: 'a6202f5f-a465-45bc-b7b0-672db7a78cd6',
    text: 'Task 1',
    done: true
}, {
    id: '9ac06ffe-e766-4a42-95d4-80c4fe5bd9b7',
    text: 'Task 2',
    done: false
}, {
    id: '543704bf-a917-417b-94df-6ca303da1bf3',
    text: 'Task 3',
    done: false
}, {
    id: 'd709de21-2f6a-466b-a660-c10cc879a420',
    text: 'Task 4',
    done: false
}], isEqual);