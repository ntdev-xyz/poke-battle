import { io } from 'socket.io-client';
import { useState } from 'react';

// "undefined" means the URL will be computed from the `window.location` object
// const URL : string = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
const URL : string = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.0.106:3001';

export const socket = io(URL, {
    autoConnect: false
});