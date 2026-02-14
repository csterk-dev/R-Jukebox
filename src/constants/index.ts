import PackageJson from "../../package.json";

/** 
 * Socket Event Keys.
 * @description An object containing the all possible connection events and their event key. 
 * @remarks Ensure that the client and server **have matching event keys.**
 */
export const SOCKET_EVENT_KEYS = {
  /** Adds to the top of the queue. */
  addToTopOfQueue: "add-to-top-of-queue",
  /** Adds to the bottom of the queue. */
  addToBottomOfQueue: "add-to-bottom-of-queue",
  /** Clears the queue. */
  clearQueue: "clear-queue",
  /** Gets the current video. */
  currentVideo: "current-video",
  /** The videos time. */
  currentVideoTime: "current-video-time",
  /** Deletes the provided item from the queue. */
  deleteQueueItem: "delete-queue-item",
  /** Used to broadcast any errors to all connected clients, in instances that a websocket response acknowledgement callback is not/cannot be present. */
  error: "error",
  /** Used to return the current state to the newly connect client. */
  getInitialState: "get-initial-state",
  /** Gets the history. */
  history: "history",
  /** If the player is loading. */
  isLoading: "is-loading",
  /** Gets the value from the isPlaying boolean. */
  isPlaying: "is-playing",
  /** Gets the player logs. */
  logs: "logs",
  /** Gets the next video in the queue. */
  playNextQueueItem: "play-next-queue-item",
  /** Gets the current ooperating player volume level. */
  playerVolume: "player-vol",
  /** Gets the queue. */
  queue: "queue",
  /** Updates the current video and sets `isPlaying` boolean to true on the server. */
  setCurrentVideo: "set-current-video",
  /** THe videos time. */
  setCurrentVideoTime: "set-current-video-time",
  /** Updates the isPlaying boolean state. */
  setIsPlaying: "set-is-playing",
  /** Updates the volume of the player. */
  setPlayerVolume: "set-player-vol"
};

export const VERSION_NUM = PackageJson.version;

/** In milliseconds. */
export const TooltipOpenDelay = 500;

/** In pixels. */
export const MOBILE_BREAKPOINT = 480;

/** Ensure front and server values match */
export const PLAYER_VOLUME_DEFAULT = 30;


/** Use when interacting with the server running on the RPI. @remarks If running on RPI 3, change to splice 5 */
const RPI_SERVER_URL = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}:3001` : "localhost:3001";
/** Use when interacting with the local server. */
const LOCAL_SERVER_URL = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host.slice(0, -5)}:3001` : "localhost:3001";

/**
 * Helper to check if we're in production mode.
 * Works in both browser (Vite) and Node.js (Chakra CLI)
 * In Vite: uses import.meta.env.PROD
 * In Node.js: uses process.env.PROD
 */
const isProduction = (): boolean => {
  // Check if we're in a browser environment with Vite
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env.PROD === true;
  }
  // Fall back to process.env for Node.js (e.g., Chakra CLI)
  if (typeof process !== "undefined" && process.env) {
    return process.env.PROD === "true" || process.env.NODE_ENV === "production";
  }
  return false;
};

/** The server URL. */
export const SERVER_URL = isProduction() ? RPI_SERVER_URL : LOCAL_SERVER_URL
// export const SERVER_URL = `${window.location.protocol}//${window.location.host.slice(0, -5)}:3001`;

export const APP_TITLE = "R Jukebox";


export const NUM_OF_SEARCH_RESULTS = 40;

export const MAX_NUM_OF_SUGGESTIONS = 10;

export const LOCAL_STORAGE_KEY_DEV_DEBUGGING = "dev_debugging";

export const LOCAL_STORAGE_KEY_CURRENT_VERSION = "current_version";

export { ALL_RELEASE_NOTES, RELEASE_NOTES_GROUP_TITLES } from "./releaseNotes";