export default class LiveQuery {
    dependents = [];
    register = (d) => {
        this.dependents.push(d);
        return d;
    };
    [Symbol.dispose]() {
        for (const d of this.dependents) {
            d.dispose();
        }
    }
}
