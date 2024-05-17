import { useToast, UseToastOptions } from "@chakra-ui/react";
import { WebSocketEventKeys } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWebSockets } from "utils/hooks";


const defaultErrorToastStyle = {
  status: "error" as UseToastOptions["status"],
  variant: "unstyled",
  duration: 10000,
  isClosable: true,
  containerStyle: {
    bg: "#B9023A",
    color: "white",
    borderRadius: 5
  }
};


interface PlayerContextType {
  currentVideo: Video | undefined;
  isPlaying: boolean;
  isPlayerLoading: boolean;
  isSocketConnected: boolean;
  error: string | undefined;
  pauseCurrentVideo: () => void;
  playVideo: (video: Video) => void;
  resumeCurrentVideo: () => void;
}

const defaultPlayerContextVal: PlayerContextType = {
  currentVideo: undefined,
  isPlaying: false,
  isPlayerLoading: false,
  isSocketConnected: false,
  error: undefined,
  pauseCurrentVideo: () => void 0,
  playVideo: () => void 0,
  resumeCurrentVideo: () => void 0
};


const PlayerContext = createContext<PlayerContextType>(defaultPlayerContextVal);

/**
 * Manage the current video player context.
 */
export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isConnected: isSocketConnected, socketInstance } = useWebSockets();


  const [currentVideo, setCurrentVideo] = useState<PlayerContextType["currentVideo"]>();
  const [isPlaying, setIsPlaying] = useState<PlayerContextType["isPlaying"]>(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState<PlayerContextType["isPlayerLoading"]>(false);
  const [error, setError] = useState<string>();
  const toast = useToast();


  /** Plays the supplied video. */
  const playVideo = useCallback((video: Video) => {
    if (!video) return;

    socketInstance.emit(WebSocketEventKeys.setCurrentVideo, video);

  }, [socketInstance]);


  /** Pauses the currently playing video. */
  const pauseCurrentVideo = useCallback(() => {
    if (!currentVideo) return;

    socketInstance.emit(WebSocketEventKeys.setIsPlaying, false);

  }, [currentVideo, socketInstance]);


  /** Pauses the currently playing video. */
  const resumeCurrentVideo = useCallback(() => {
    if (!currentVideo) return;

    socketInstance.emit(WebSocketEventKeys.setIsPlaying, true);

  }, [currentVideo, socketInstance]);


  /**
   * Automiatically sync the currenVideo, error, isPlaying and isLoading states from the server if the socket is connected.
   */
  useEffect(() => {
    if (isSocketConnected) {

      socketInstance.on(WebSocketEventKeys.currentVideo, (video: Video | undefined) => {
        if (video?.videoId !== currentVideo?.videoId) {
          setCurrentVideo(video);
        }
      });

      socketInstance.on(WebSocketEventKeys.error, (errorMessage: string) => {
        setError(errorMessage);
        toast({
          title: "Player error",
          description: errorMessage,
          ...defaultErrorToastStyle
        });
      });

      socketInstance.on(WebSocketEventKeys.isLoading, (loading: boolean) => {
        setIsPlayerLoading(loading);
      });

      socketInstance.on(WebSocketEventKeys.isPlaying, (playing: boolean) => {
        if (playing !== isPlaying) {
          setIsPlaying(playing);
        }
      });
    }
  }, [currentVideo?.videoId, isPlaying, isSocketConnected, socketInstance, toast]);


  const playerContext: PlayerContextType = useMemo(() => {
    return {
      currentVideo,
      isPlaying,
      isPlayerLoading,
      isSocketConnected,
      error,
      pauseCurrentVideo,
      playVideo,
      resumeCurrentVideo
    }
  }, [currentVideo, error, isPlayerLoading, isPlaying, isSocketConnected, pauseCurrentVideo, playVideo, resumeCurrentVideo]);

  return (
    <PlayerContext.Provider value={playerContext}>
      {children}
    </PlayerContext.Provider>
  )
}

/** Allows access to the current player context values and functions. */
export const usePlayer = (): PlayerContextType => useContext(PlayerContext);