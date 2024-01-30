import { Manager } from 'socket.io-client';
import { connection } from './const';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? connection.prodURL : connection.devURL;
const manager = new Manager(URL, {
  autoConnect: false
});

export const socket = manager.socket("/");
