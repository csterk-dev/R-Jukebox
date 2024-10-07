import { useToast, UseToastOptions } from "@chakra-ui/react";
import { APP_TITLE, PLAYER_VOLUME_DEFAULT, SOCKET_EVENT_KEYS } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWebSockets } from "utils/hooks";
import { replaceHtmlEntities } from "utils/misc";


const errorToastProps = {
  status: "error" as UseToastOptions["status"],
  variant: "error",
  duration: 10000,
  isClosable: true
};

/** ID's are used to ensure that toasts do not duplicate and visually stack. */
const toastIds = {
  playerError: "we456iuhrskha72"
};

interface PlayerContextType {
  addToBottomOfQueue: (video: Video) => void;
  addToTopOfQueue: (video: Video) => void;
  clearQueue: () => void;
  currentVideo: Video | undefined;
  currentVideoTime: number | undefined;
  deleteQueueItem: (videoId: Video["videoId"]) => void;
  error: string | undefined;
  history: HistoryVideo[];
  isConnected: boolean;
  isPlaying: boolean;
  isPlayerLoading: boolean;
  pauseCurrentVideo: () => void;
  playVideo: (video: Video) => void;
  playNextQueueItem: () => void;
  playerVolume: number;
  queue: Video[];
  resumeCurrentVideo: () => void;
  updatePlayerVolume: (volume: number) => void;
  updateCurrentVideoTime: (newTime: number) => void;
}

const defaultPlayerContextVal: PlayerContextType = {
  addToBottomOfQueue: () => void 0,
  addToTopOfQueue: () => void 0,
  clearQueue: () => void 0,
  currentVideo: undefined,
  currentVideoTime: undefined,
  deleteQueueItem: () => void 0,
  error: undefined,
  history: [],
  isConnected: false,
  isPlaying: false,
  isPlayerLoading: false,
  pauseCurrentVideo: () => void 0,
  playVideo: () => void 0,
  playNextQueueItem: () => void 0,
  playerVolume: PLAYER_VOLUME_DEFAULT,
  queue: [],
  resumeCurrentVideo: () => void 0,
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
  const [volume, setVolume] = useState<PlayerContextType["playerVolume"]>(PLAYER_VOLUME_DEFAULT);
  const [history, setHistory] = useState<PlayerContextType["history"]>([]);
  const [queue, setQueue] = useState<PlayerContextType["queue"]>([]);


  /** Pauses the current video. */
  const pauseCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setIsPlaying, socketInstance.id, false);

  }, [currentVideo, socketInstance]);


  /** Starts the player with the provided video. */
  const playVideo = useCallback((video: Video) => {
    socketInstance.emit(SOCKET_EVENT_KEYS.setCurrentVideo, socketInstance.id, video);

  }, [socketInstance]);


  /** Adds the provided video to the start of the queue. */
  const addToTopOfQueue = useCallback((video: Video) => {
    socketInstance.emit(SOCKET_EVENT_KEYS.addToTopOfQueue, socketInstance.id, video);

  }, [socketInstance]);


  /** Adds the provided video to the end of the queue. */
  const addToBottomOfQueue = useCallback((video: Video) => {
    socketInstance.emit(SOCKET_EVENT_KEYS.addToBottomOfQueue, socketInstance.id, video);
    
  }, [socketInstance]);


  /** Plays the next video from the queue. */
  const playNextQueueItem = useCallback(() => {
    socketInstance.emit(SOCKET_EVENT_KEYS.playNextQueueItem, socketInstance.id);

  }, [socketInstance]);

  const clearQueue = useCallback(() => {
    if (queue.length === 0) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.clearQueue, socketInstance.id);

  }, [queue.length, socketInstance]);

  /** Deletes the specified video from the queue. */
  const deleteQueueItem = useCallback((videoId: Video["videoId"]) => {
    socketInstance.emit(SOCKET_EVENT_KEYS.deleteQueueItem, socketInstance.id, videoId);

  }, [socketInstance]);

  /** Resumes the current video. */
  const resumeCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    socketInstance.emit(SOCKET_EVENT_KEYS.setIsPlaying, socketInstance.id, true);

  }, [currentVideo, socketInstance]);


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
            ...errorToastProps
          });
        }
      });


      // Sync history
      socketInstance.on(SOCKET_EVENT_KEYS.history, (incomingHistory: HistoryVideo[]) => {
        console.log("history synced");
        setHistory(incomingHistory);
      });


      // Sync queue
      socketInstance.on(SOCKET_EVENT_KEYS.queue, (incomingQueue: Video[]) => {
        console.log("queue synced");
        setQueue(incomingQueue);
      });


      // Sync loading state
      socketInstance.on(SOCKET_EVENT_KEYS.isLoading, (loading: boolean) => {
        setIsPlayerLoading(loading);
        document.title = "Loading..."
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
      socketInstance.off(SOCKET_EVENT_KEYS.history);
      socketInstance.off(SOCKET_EVENT_KEYS.queue);
      socketInstance.off(SOCKET_EVENT_KEYS.isLoading);
      socketInstance.off(SOCKET_EVENT_KEYS.isPlaying);
      socketInstance.off(SOCKET_EVENT_KEYS.playerVolume);
    }
  }, [currentVideo?.videoId, isPlaying, isConnected, updatePlayerVolume, socketInstance, toast, volume, currentVideo, currentVideoTime]);


  const playerContext: PlayerContextType = useMemo(() => {
    return {
      clearQueue,
      currentVideo,
      currentVideoTime,
      deleteQueueItem,
      error,
      history,
      isConnected,
      isPlaying,
      isPlayerLoading,
      pauseCurrentVideo,
      playVideo,
      playNextQueueItem,
      addToTopOfQueue,
      addToBottomOfQueue,
      playerVolume: volume,
      queue,
      resumeCurrentVideo,
      updatePlayerVolume,
      updateCurrentVideoTime
    }
  }, [clearQueue, currentVideo, currentVideoTime, deleteQueueItem, error, history, isConnected, isPlaying, isPlayerLoading, pauseCurrentVideo, playVideo, playNextQueueItem, addToTopOfQueue, addToBottomOfQueue, volume, queue, resumeCurrentVideo, updatePlayerVolume, updateCurrentVideoTime]);

  return (
    <PlayerContext.Provider value={playerContext}>
      {children}
    </PlayerContext.Provider>
  )
}

/** Allows access to the current player context values and functions. */
export const usePlayer = (): PlayerContextType => useContext(PlayerContext);