import { io } from "socket.io-client";

const socketUrl = `${window.location.protocol}//${window.location.host.slice(0, -5)}:3001`;


/** The socket instance hosted on the server. */
export const socket = io(socketUrl);