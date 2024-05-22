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
  /** Updates the volume of the operating system. */
  setSystemVolume: "set-system-vol",
  /** Gets the current ooperating system volume level. */
  systemVolume: "system-vol"
};


/** In milliseconds. */
export const TooltipOpenDelay = 500;

/** In pixsels. */
export const HEADER_HEIGHT = 60;

/** In pixsels. */
export const MOBILE_BREAKPOINT = 500;

/** Ensure front and end values match */
export const SYSTEM_VOLUME_DEFAULT = 30;