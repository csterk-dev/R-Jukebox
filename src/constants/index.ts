/** 
 * An object containing the all possible connection events and their event key. 
 * 
 * Ensure that the client and server **have matching event keys.**
 */
export const SOCKET_EVENT_KEYS = {
  /** Used to return the current state to the newly connect client. */
  getInitialState: "get-initial-state",
  /** Gets the current video. */
  currentVideo: "current-video",
  /** THe videos time. */
  currentVideoTime: "current-video-time",
  /** Any error values. */
  error: "error",
  /** If the player is loading. */
  isLoading: "is-loading",
  /** Gets the value from the isPlaying boolean. */
  isPlaying: "is-playing",
  /** Updates the current video and sets `isPlaying` boolean to true on the server. */
  setCurrentVideo: "set-current-video",
  /** Updates the isPlaying boolean state. */
  setIsPlaying: "set-is-playing",
  /** Updates the volume of the player. */
  setPlayerVolume: "set-player-vol",
  /** Gets the current ooperating player volume level. */
  playerVolume: "player-vol"
};


/** In milliseconds. */
export const TooltipOpenDelay = 500;

/** In pixels. */
export const HEADER_HEIGHT = 60;

/** In pixels. */
export const MOBILE_BREAKPOINT = 500;

/** Ensure front and end values match */
export const SYSTEM_VOLUME_DEFAULT = 30;

/** URL of the server. */
export const SOCKET_URL = `${window.location.protocol}//${window.location.host.slice(0, -5)}:3001`;