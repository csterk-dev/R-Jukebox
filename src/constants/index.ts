/** 
 * Socket Event Keys.
 * @description An object containing the all possible connection events and their event key. 
 * @remarks Ensure that the client and server **have matching event keys.**
 */
export const SOCKET_EVENT_KEYS = {
  /** Used to return the current state to the newly connect client. */
  getInitialState: "get-initial-state",
  /** Gets the current video. */
  currentVideo: "current-video",
  /** The videos time. */
  currentVideoTime: "current-video-time",
  /** Any error values. */
  error: "error",
  /** The history. */
  history: "history",
  /** If the player is loading. */
  isLoading: "is-loading",
  /** Gets the value from the isPlaying boolean. */
  isPlaying: "is-playing",
  /** Gets the current ooperating player volume level. */
  playerVolume: "player-vol",
  /** Updates the current video and sets `isPlaying` boolean to true on the server. */
  setCurrentVideo: "set-current-video",
  /** THe videos time. */
  setCurrentVideoTime: "set-current-video-time",
  /** Updates the isPlaying boolean state. */
  setIsPlaying: "set-is-playing",
  /** Updates the volume of the player. */
  setPlayerVolume: "set-player-vol"
};

export const VERSION_NUM = "1.1.1";

/** In milliseconds. */
export const TooltipOpenDelay = 500;

/** In pixels. */
export const HEADER_HEIGHT = 60;

/** In pixels. */
export const MOBILE_BREAKPOINT = 550;

/** Ensure front and server values match */
export const PLAYER_VOLUME_DEFAULT = 30;


/** Use when interacting with the server running on the RPI. */
const RPI_SERVER_URL = "http://192.168.1.16:3001";
/** Use when interacting with the local server. */
const LOCAL_SERVER_URL = `${window.location.protocol}//${window.location.host.slice(0, -5)}:3001`;

/** The server URL. */
export const SERVER_URL = process.env.NODE_ENV === "production" ? RPI_SERVER_URL : LOCAL_SERVER_URL

export const APP_TITLE = "R Jukebox";