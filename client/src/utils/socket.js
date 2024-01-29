import { io, Manager } from 'socket.io-client';
import { connection } from './const';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : connection.serverURL;
const manager = new Manager(connection.serverURL, {
  autoConnect: false
});

export const socket = manager.socket("/");
