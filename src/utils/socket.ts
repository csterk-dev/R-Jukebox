import { SOCKET_URL } from "../constants";
import { io } from "socket.io-client";


/** The socket instance hosted on the server. */
export const socket = io(SOCKET_URL);