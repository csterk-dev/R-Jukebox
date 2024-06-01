import { useToast, UseToastOptions } from "@chakra-ui/react";
import { SOCKET_EVENT_KEYS, SYSTEM_VOLUME_DEFAULT } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWebSockets } from "utils/hooks";
import { formatISO8601ToSeconds } from "utils/misc";


const defaultErrorToastStyle = {
  status: "error" as UseToastOptions["status"],
  variant: "unstyled",
  duration: 10000,
  isClosable: true,
  containerStyle: {
    bg: "#B9023A",
    color: "#ffffff",
    borderRadius: 5
  }
};

/** ID's are used to ensure that toasts do not duplicate and visually stack. */
const toastIds = {
  playerError: "we456iuhrskha72"
};

interface PlayerContextType {
  currentVideo: Video | undefined;
  currentVideoTime: number | undefined;
  error: string | undefined;
  isConnected: boolean;
  isPlaying: boolean;
  isPlayerLoading: boolean;
  pauseCurrentVideo: () => void;
  playVideo: (video: Video) => void;
  resumeCurrentVideo: () => void;
  systemVolume: number;
  setSystemVolume: (volume: number) => void;
}

const defaultPlayerContextVal: PlayerContextType = {
  currentVideo: undefined,
  currentVideoTime: undefined,
  error: undefined,
  isConnected: false,
  isPlaying: false,
  isPlayerLoading: false,
  pauseCurrentVideo: () => void 0,
  playVideo: () => void 0,
  resumeCurrentVideo: () => void 0,
  systemVolume: SYSTEM_VOLUME_DEFAULT,
  setSystemVolume: () => void 0
};


const PlayerContext = createContext<PlayerContextType>(defaultPlayerContextVal);

/**
 * Manage the current video player context.
 */
export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const { isConnected, socket } = useWebSockets();


  const [currentVideo, setCurrentVideo] = useState<PlayerContextType["currentVideo"]>();
  const [currentVideoTime, setCurrentVideoTime] = useState<PlayerContextType["currentVideoTime"]>();
  const [isPlaying, setIsPlaying] = useState<PlayerContextType["isPlaying"]>(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState<PlayerContextType["isPlayerLoading"]>(false);
  const [error, setError] = useState<PlayerContextType["error"]>();
  const [volume, setVolume] = useState<PlayerContextType["systemVolume"]>(SYSTEM_VOLUME_DEFAULT);


  /** Set the volume of the player. */
  const setSystemVolume = useCallback((value: number) => {
    socket.emit(SOCKET_EVENT_KEYS.setSystemVolume, value);

  }, [socket]);


  /** Starts the player with the provided video. */
  const playVideo = useCallback((video: Video) => {
    if (!video) return;
    socket.emit(SOCKET_EVENT_KEYS.setCurrentVideo, video);

  }, [socket]);


  /** Pauses the current video. */
  const pauseCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    socket.emit(SOCKET_EVENT_KEYS.setIsPlaying, false);

  }, [currentVideo, socket]);


  /** Resumes the current video. */
  const resumeCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    socket.emit(SOCKET_EVENT_KEYS.setIsPlaying, true);

  }, [currentVideo, socket]);


  /**
   * Automiatically sync the various states from the server if the socket is connected.
   */
  useEffect(() => {
    if (isConnected) {

      // Sync current video state
      socket.on(SOCKET_EVENT_KEYS.currentVideo, (incomingVideo: Video | undefined) => {
        console.log("currentVideo", currentVideo);
        console.log("incomingVideo", incomingVideo);

        if (currentVideo?.videoId !== incomingVideo?.videoId) {
          console.log("current video synced");
          setCurrentVideo(incomingVideo);
        }
      });


      // Sync current video time
      socket.on(SOCKET_EVENT_KEYS.currentVideoTime, (incomingCurrentVideoTime: number) => {
        console.log("incomingCurrentVideoTime", incomingCurrentVideoTime);

        if (currentVideoTime !== incomingCurrentVideoTime) {
          console.log("Time synced");
          setCurrentVideoTime(incomingCurrentVideoTime);
        }
      });


      // Sync error state
      socket.on(SOCKET_EVENT_KEYS.error, (errorMessage: string) => {
        setError(errorMessage);
        if (!toast.isActive(toastIds.playerError)) {
          toast({
            id: toastIds.playerError,
            title: "Player error",
            description: errorMessage,
            ...defaultErrorToastStyle
          });
        }
      });


      // Sync loading state
      socket.on(SOCKET_EVENT_KEYS.isLoading, (loading: boolean) => {
        setIsPlayerLoading(loading);
      });


      // Sync playing state
      socket.on(SOCKET_EVENT_KEYS.isPlaying, (incomingIsPlaying: boolean) => {
        console.log("isPlaying", isPlaying);
        console.log("incomingIsPlaying", incomingIsPlaying);

        if (isPlaying !== incomingIsPlaying) {
          console.log("isPlaying synced");
          setIsPlaying(incomingIsPlaying);
        }
      });


      // Sync system volume state
      socket.on(SOCKET_EVENT_KEYS.systemVolume, (incomingVolume: number) => {
        console.log("volume", volume);
        console.log("incomingVolume", incomingVolume);

        if (incomingVolume !== volume) {
          console.log("volume synced");
          setVolume(incomingVolume);
        }
      });
    }
  }, [currentVideo?.videoId, isPlaying, isConnected, setSystemVolume, socket, toast, volume, currentVideo, currentVideoTime]);


  const playerContext: PlayerContextType = useMemo(() => {
    return {
      currentVideo,
      currentVideoTime,
      error,
      isConnected,
      isPlaying,
      isPlayerLoading,
      pauseCurrentVideo,
      playVideo,
      resumeCurrentVideo,
      systemVolume: volume,
      setSystemVolume
    }
  }, [currentVideo, currentVideoTime, error, isConnected, isPlayerLoading, isPlaying, pauseCurrentVideo, playVideo, resumeCurrentVideo, setSystemVolume, volume]);

  return (
    <PlayerContext.Provider value={playerContext}>
      {children}
    </PlayerContext.Provider>
  )
}

/** Allows access to the current player context values and functions. */
export const usePlayer = (): PlayerContextType => useContext(PlayerContext);