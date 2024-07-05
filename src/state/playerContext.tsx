import { useToast, UseToastOptions } from "@chakra-ui/react";
import { APP_TITLE, SOCKET_EVENT_KEYS, SYSTEM_VOLUME_DEFAULT } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWebSockets } from "utils/hooks";
import { replaceHtmlEntities } from "utils/misc";


const defaultErrorToastStyle = {
  status: "error" as UseToastOptions["status"],
  variant: "unstyled",
  duration: 30000,
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
  playerVolume: number;
  updatePlayerVolume: (volume: number) => void;
  updateCurrentVideoTime: (newTime: number) => void;
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
  playerVolume: SYSTEM_VOLUME_DEFAULT,
  updatePlayerVolume: () => void 0,
  updateCurrentVideoTime: () => void 0
};


const PlayerContext = createContext<PlayerContextType>(defaultPlayerContextVal);

/**
 * Manage the current video player context.
 */
export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const { isConnected, socketInstance } = useWebSockets();


  const [currentVideo, setCurrentVideo] = useState<PlayerContextType["currentVideo"]>();
  const [currentVideoTime, setCurrentVideoTime] = useState<PlayerContextType["currentVideoTime"]>();
  const [isPlaying, setIsPlaying] = useState<PlayerContextType["isPlaying"]>(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState<PlayerContextType["isPlayerLoading"]>(false);
  const [error, setError] = useState<PlayerContextType["error"]>();
  const [volume, setVolume] = useState<PlayerContextType["playerVolume"]>(SYSTEM_VOLUME_DEFAULT);


  /** Set the volume of the player. */
  const updateCurrentVideoTime = useCallback((time: number) => {
    if (!currentVideo) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setCurrentVideoTime, socketInstance.id, time);

  }, [currentVideo, socketInstance]);


  /** Set the volume of the player. */
  const updatePlayerVolume = useCallback((volLevel: number) => {
    if (!currentVideo) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setPlayerVolume, socketInstance.id, volLevel);

  }, [currentVideo, socketInstance]);


  /** Starts the player with the provided video. */
  const playVideo = useCallback((video: Video) => {
    if (!video) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setCurrentVideo, video);

  }, [socketInstance]);


  /** Pauses the current video. */
  const pauseCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setIsPlaying, socketInstance.id, false);

  }, [currentVideo, socketInstance]);


  /** Resumes the current video. */
  const resumeCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setIsPlaying, socketInstance.id, true);

  }, [currentVideo, socketInstance]);


  /**
   * Automiatically sync the various states from the server if the socketInstance is connected.
   */
  useEffect(() => {
    if (isConnected) {

      // Sync current video state
      socketInstance.on(SOCKET_EVENT_KEYS.currentVideo, (incomingVideo: Video | undefined) => {
        if (currentVideo?.videoId !== incomingVideo?.videoId) {
          console.log("current video synced");
          setCurrentVideo(incomingVideo);
          const vidTitle = replaceHtmlEntities(incomingVideo?.title);
          if (vidTitle) {
            document.title = vidTitle;
          } else {
            document.title = APP_TITLE
          }
        }
      });


      // Sync current video time
      socketInstance.on(SOCKET_EVENT_KEYS.currentVideoTime, (incomingCurrentVideoTime: number) => {
        if (currentVideoTime !== incomingCurrentVideoTime) {
          console.log("Time synced");
          setCurrentVideoTime(incomingCurrentVideoTime);
        }
      });


      // Sync error state
      socketInstance.on(SOCKET_EVENT_KEYS.error, (errorMessage: string) => {
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
      socketInstance.on(SOCKET_EVENT_KEYS.isLoading, (loading: boolean) => {
        setIsPlayerLoading(loading);
        document.title = "Loading song"
      });


      // Sync playing state
      socketInstance.on(SOCKET_EVENT_KEYS.isPlaying, (incomingIsPlaying: boolean) => {
        if (isPlaying !== incomingIsPlaying) {
          console.log("isPlaying synced");
          setIsPlaying(incomingIsPlaying);
        }
      });


      // Sync player volume state
      socketInstance.on(SOCKET_EVENT_KEYS.playerVolume, (incomingVolume: number) => {
        if (incomingVolume !== volume) {
          console.log("volume synced");
          setVolume(incomingVolume);
        }
      });
    }

    return () => {
      socketInstance.off(SOCKET_EVENT_KEYS.currentVideo);
      socketInstance.off(SOCKET_EVENT_KEYS.currentVideoTime);
      socketInstance.off(SOCKET_EVENT_KEYS.error);
      socketInstance.off(SOCKET_EVENT_KEYS.isLoading);
      socketInstance.off(SOCKET_EVENT_KEYS.isPlaying);
      socketInstance.off(SOCKET_EVENT_KEYS.playerVolume);
    }
  }, [currentVideo?.videoId, isPlaying, isConnected, updatePlayerVolume, socketInstance, toast, volume, currentVideo, currentVideoTime]);


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
      playerVolume: volume,
      updatePlayerVolume,
      updateCurrentVideoTime
    }
  }, [currentVideo, currentVideoTime, error, isConnected, isPlayerLoading, isPlaying, pauseCurrentVideo, playVideo, resumeCurrentVideo, updateCurrentVideoTime, updatePlayerVolume, volume]);

  return (
    <PlayerContext.Provider value={playerContext}>
      {children}
    </PlayerContext.Provider>
  )
}

/** Allows access to the current player context values and functions. */
export const usePlayer = (): PlayerContextType => useContext(PlayerContext);