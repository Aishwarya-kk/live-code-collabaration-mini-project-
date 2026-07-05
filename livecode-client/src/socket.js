// src/socket.js
import { io } from "socket.io-client";

// Make sure this matches your backend server port!
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;