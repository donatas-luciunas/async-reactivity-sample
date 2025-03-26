import { Connection } from 'async-reactivity-net';
import { SocketSampleLiveQuery } from '@async-reactivity-sample/business-logic';

const socket = new WebSocket("ws://localhost:8080");

const connection = new Connection(socket, [SocketSampleLiveQuery]);

export const query = new SocketSampleLiveQuery(connection);
connection.add(query);