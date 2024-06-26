import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://blog-backend-ai0z.onrender.com';

export const socket = io(URL);