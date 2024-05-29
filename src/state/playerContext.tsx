import { useToast, UseToastOptions } from "@chakra-ui/react";
import { SOCKET_EVENT_KEYS, SYSTEM_VOLUME_DEFAULT } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWebSockets } from "utils/hooks";


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
  const { isConnected, socketInstance } = useWebSockets();


  const [currentVideo, setCurrentVideo] = useState<PlayerContextType["currentVideo"]>();
  const [isPlaying, setIsPlaying] = useState<PlayerContextType["isPlaying"]>(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState<PlayerContextType["isPlayerLoading"]>(false);
  const [error, setError] = useState<PlayerContextType["error"]>();
  const [volume, setVolume] = useState<PlayerContextType["systemVolume"]>(SYSTEM_VOLUME_DEFAULT);
  const toast = useToast();


  /** Set the volume of the player. */
  const setSystemVolume = useCallback((value: number) => {
    socketInstance.emit(SOCKET_EVENT_KEYS.setSystemVolume, value);

  }, [socketInstance]);


  /** Starts the player with the provided video. */
  const playVideo = useCallback((video: Video) => {
    if (!video) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setCurrentVideo, video);

  }, [socketInstance]);


  /** Pauses the current video. */
  const pauseCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setIsPlaying, false);

  }, [currentVideo, socketInstance]);


  /** Resumes the current video. */
  const resumeCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setIsPlaying, true);

  }, [currentVideo, socketInstance]);


  /**
   * Automiatically sync the various states from the server if the socket is connected.
   */
  useEffect(() => {
    if (isConnected) {

      // Sync current video state
      socketInstance.on(SOCKET_EVENT_KEYS.currentVideo, (incomingVideo: Video | undefined) => {
        console.log("currentVideo", currentVideo);
        console.log("incomingVideo", incomingVideo);

        if (currentVideo?.videoId !== incomingVideo?.videoId) {
          console.log("current video synced");
          setCurrentVideo(incomingVideo);
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
      });

      
      // Sync playing state
      socketInstance.on(SOCKET_EVENT_KEYS.isPlaying, (incomingIsPlaying: boolean) => {
        console.log("isPlaying", isPlaying);
        console.log("incomingIsPlaying", incomingIsPlaying);

        if (isPlaying !== incomingIsPlaying) {
          console.log("isPlaying synced");
          setIsPlaying(incomingIsPlaying);
        }
      });


      // Sync system volume state
      socketInstance.on(SOCKET_EVENT_KEYS.systemVolume, (incomingVolume: number) => {
        console.log("volume", volume);
        console.log("incomingVolume", incomingVolume);

        if (incomingVolume !== volume) {
          console.log("volume synced");
          setVolume(incomingVolume);
        }
      });
    }
  }, [currentVideo?.videoId, isPlaying, isConnected, setSystemVolume, socketInstance, toast, volume, currentVideo]);


  const playerContext: PlayerContextType = useMemo(() => {
    return {
      currentVideo,
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
  }, [currentVideo, error, isConnected, isPlayerLoading, isPlaying, pauseCurrentVideo, playVideo, resumeCurrentVideo, setSystemVolume, volume]);

  return (
    <PlayerContext.Provider value={playerContext}>
      {children}
    </PlayerContext.Provider>
  )
}

/** Allows access to the current player context values and functions. */
export const usePlayer = (): PlayerContextType => useContext(PlayerContext);