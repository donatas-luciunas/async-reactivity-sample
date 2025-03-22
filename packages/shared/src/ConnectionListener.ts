// import AsyncListener from "./AsyncListener.js";
// import LiveQuery from "./LiveQuery.js";

// export default class ConnectionListener<T> extends AsyncListener<T> {
//     constructor(liveQuery: LiveQuery, path: string) {
//         super(
//             () => liveQuery.connection.watch(path),
//             () => liveQuery.connection.unwatch(path)
//         );
//     }
// }