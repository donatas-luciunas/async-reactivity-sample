import { Dependent } from "async-reactivity";
import Connection from "./Connection";

export default abstract class LiveQuery {
    private _id: string;
    protected connection: Connection;
    private dependents: Dependent[] = [];

    constructor(connection: Connection, id?: string) {
        this.connection = connection;
        this._id = id ?? (Math.random() * 100000).toFixed(0)
    }

    protected register = <T extends Dependent>(d: T): T => {
        this.dependents.push(d);
        return d;
    };

    public get id() {
        return this._id;
    }

    [Symbol.dispose]() {
        for (const d of this.dependents) {
            d.dispose();
        }
    }
}