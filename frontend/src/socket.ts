import { io } from 'socket.io-client';

// Ensure this matches the backend port
const URL = 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: false
});
