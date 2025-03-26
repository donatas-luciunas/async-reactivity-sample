export interface DataItem {
    id: string;
    text: string;
    done: boolean;
}

const items = new Map([{
    id: 'a6202f5f-a465-45bc-b7b0-672db7a78cd6',
    text: 'Task 1',
    done: true
} as DataItem, {
    id: '9ac06ffe-e766-4a42-95d4-80c4fe5bd9b7',
    text: 'Task 2',
    done: false
} as DataItem, {
    id: '543704bf-a917-417b-94df-6ca303da1bf3',
    text: 'Task 3',
    done: false
} as DataItem, {
    id: 'd709de21-2f6a-466b-a660-c10cc879a420',
    text: '',
    done: false
} as DataItem].map(i => [i.id, i]));

export const list = async () => [...items.values()];

export const get = async (id: string) => items.get(id);

export const remove = async (id: string) => items.delete(id);

const subscribers = new Set<Function>();

export const write = async () => {
    for (const s of subscribers) {
        s();
    }
};

export const subscribe = (subscriber: Function) => {
    subscribers.add(subscriber);
};

export const unsubscribe = (subscriber: Function) => {
    subscribers.delete(subscriber);
};