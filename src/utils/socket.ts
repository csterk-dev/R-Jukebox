import { SERVER_URL } from "../constants";
import { io } from "socket.io-client";

/** 
 * The socket instance hosted on the server. 
 * 
 * This is delcared here to prevent 'Websocket Connection Error Insufficient Resources' error 
 * that would occur if we use the socket directly in the useWebSocket hook.
 * 
 * See [this stack overflow article for more info](https://stackoverflow.com/questions/69008820/websocket-connection-error-insufficient-resources).
 */
export const socket = io(SERVER_URL);