import { io } from 'socket.io-client';

// Always connect to the deployed Render backend
const URL = 'https://syncstream-nv7d.onrender.com';

export const socket = io(URL, {
  autoConnect: false
});
