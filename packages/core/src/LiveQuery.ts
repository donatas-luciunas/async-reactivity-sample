import { Dependent } from "async-reactivity";
import { v4 as uuidv4 } from 'uuid';
import Connection from "./Connection.js";

export default abstract class LiveQuery {
    public readonly id: string;
    public readonly connection: Connection;
    private dependents: Dependent[] = [];

    constructor(connection: Connection, id?: string) {
        this.connection = connection;
        this.id = id ?? uuidv4();
    }

    protected register = <T extends Dependent>(d: T): T => {
        this.dependents.push(d);
        return d;
    };

    [Symbol.dispose]() {
        for (const d of this.dependents) {
            d.dispose();
        }
    }
}