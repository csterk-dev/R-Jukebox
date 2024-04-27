import { io } from "socket.io-client";


const socketUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

/** The socket instance hosted on the server. */
export const socket = io(socketUrl);