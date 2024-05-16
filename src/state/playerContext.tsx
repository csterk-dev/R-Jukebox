import { useToast, UseToastOptions } from "@chakra-ui/react";
import { WebSocketEventKeys } from "../constants";
import { logAxiosError } from "@usesoftwareau/react-utils";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PlayerAPI } from "utils/api";
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

    setIsPlayerLoading(true);

    const playPromise = PlayerAPI.playVideo(video.videoId);
    playPromise
      .then(() => {
        // Optimistically update the current video state and broadcast the new video to the socket
        socketInstance.emit(WebSocketEventKeys.setCurrentVideo, video);
        setCurrentVideo(video)
        setIsPlaying(true);
        setError(undefined);
      })
      .catch((err) => {
        console.log("Error playing video");
        logAxiosError(err);
        setError(err.message);
        toast({
          title: "Error playing video",
          description: err.message,
          ...defaultErrorToastStyle
        });
      })
      .finally((() => {
        setIsPlayerLoading(false);
      }))
  }, [socketInstance, toast]);


  /** Pauses the currently playing video. */
  const pauseCurrentVideo = useCallback(() => {
    if (!currentVideo) return;

    const playPromise = PlayerAPI.pauseVideo(currentVideo.videoId);
    playPromise
      .then((() => {
        // Optimistically update the playing state and broadcast the new video to the socket
        socketInstance.emit(WebSocketEventKeys.setIsPlaying, false);
        setIsPlaying(false);
        setError(undefined);
      }))
      .catch((err) => {
        console.log("Error playing video");
        logAxiosError(err);
        setError(err.message);
        toast({
          title: "Error pausing video",
          description: err.message,
          ...defaultErrorToastStyle
        });
      });
  }, [currentVideo, socketInstance, toast]);


  /** Pauses the currently playing video. */
  const resumeCurrentVideo = useCallback(() => {
    if (!currentVideo) return;

    const playPromise = PlayerAPI.playVideo(currentVideo.videoId);
    playPromise
      .then(() => {
        socketInstance.emit(WebSocketEventKeys.setIsPlaying, true);
        setIsPlaying(true);
        setError(undefined);
      })
      .catch((err) => {
        console.log("Error playing video");
        logAxiosError(err);
        setError(err.message);
        toast({
          title: "Error playing video",
          description: err.message,
          ...defaultErrorToastStyle
        });
      });
  }, [currentVideo, socketInstance, toast]);


  /**
   * Automiatically sync the isPlaying and currenVideo states from the server if the socket is connected.
   */
  useEffect(() => {
    if (isSocketConnected) {

      socketInstance.on(WebSocketEventKeys.currentVideo, (video: Video | undefined) => {
        if (video?.videoId !== currentVideo?.videoId) {
          setCurrentVideo(video);
        }
      });

      socketInstance.on(WebSocketEventKeys.isPlaying, (playing: boolean) => {
        if (playing !== isPlaying) {
          setIsPlaying(playing);
        }
      })
    }
  }, [currentVideo?.videoId, isPlaying, isSocketConnected, socketInstance]);


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