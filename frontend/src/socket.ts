import { io } from 'socket.io-client';

// Ensure this matches the backend port
const URL = 'https://syncstream-nv7d.onrender.com';

export const socket = io(URL, {
  autoConnect: false
});
