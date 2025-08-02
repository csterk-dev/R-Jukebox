import { useToast, UseToastOptions } from "@chakra-ui/react";
import { APP_TITLE, PLAYER_VOLUME_DEFAULT, SOCKET_EVENT_KEYS } from "../constants";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWebSockets } from "utils/hooks";
import { replaceHtmlEntities, truncateString } from "utils/misc";
import { usePrevious } from "@usesoftwareau/react-utils";
import { usePaginatedListHistory } from "./swr";

const queueToastProps = {
  status: "success" as UseToastOptions["status"],
  variant: "success",
  duration: 5000,
  isClosable: true
};

const errorToastProps = {
  status: "error" as UseToastOptions["status"],
  variant: "error",
  duration: 10000,
  isClosable: true
};

// const infoToastProps = {
//   status: "info" as UseToastOptions["status"],
//   variant: "info",
//   duration: 6000,
//   isClosable: false
// };


/** ID's are used to ensure that toasts do not duplicate and visually stack. */
const toastIds = {
  playerError: "we456iuhrskha72"
};

interface PlayerContextType {
  addToBottomOfQueue: (video: Video, action: "add" | "move") => void;
  addToTopOfQueue: (video: Video, action: "add" | "move") => void;
  clearQueue: () => void;
  currentVideo: Video | undefined;
  currentVideoTime: number | undefined;
  deleteQueueItem: (videoId: Video["videoId"]) => void;
  error: string | undefined;
  isConnected: boolean;
  isPlaying: boolean;
  isPlayerLoading: boolean;
  logs: EntryLog[];
  pauseResumeCurrentVideo: (action: "resume" | "pause") => void;
  playVideo: (video: Video) => void;
  playNextQueueItem: () => void;
  playerVolume: number;
  queue: Video[];
  updatePlayerVolume: (volume: number) => void;
  updatePlayerTimestamp: (newTime: number) => void;
}

const defaultPlayerContextVal: PlayerContextType = {
  addToBottomOfQueue: () => void 0,
  addToTopOfQueue: () => void 0,
  clearQueue: () => void 0,
  currentVideo: undefined,
  currentVideoTime: undefined,
  deleteQueueItem: () => void 0,
  error: undefined,
  isConnected: false,
  isPlaying: false,
  isPlayerLoading: false,
  logs: [],
  pauseResumeCurrentVideo: () => void 0,
  playVideo: () => void 0,
  playNextQueueItem: () => void 0,
  playerVolume: PLAYER_VOLUME_DEFAULT,
  queue: [],
  updatePlayerVolume: () => void 0,
  updatePlayerTimestamp: () => void 0
};


const PlayerContext = createContext<PlayerContextType>(defaultPlayerContextVal);

/**
 * Manage the current video player context.
 */
export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const toast = useToast();
  const { isConnected, socketInstance } = useWebSockets();
  const previousIsConnected = usePrevious(isConnected);
  const { mutate: updateHistory } = usePaginatedListHistory();


  const [currentVideo, setCurrentVideo] = useState<PlayerContextType["currentVideo"]>();
  const [currentVideoTime, setCurrentVideoTime] = useState<PlayerContextType["currentVideoTime"]>();
  const [isPlaying, setIsPlaying] = useState<PlayerContextType["isPlaying"]>(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState<PlayerContextType["isPlayerLoading"]>(false);
  const [error, setError] = useState<PlayerContextType["error"]>();
  const [volume, setVolume] = useState<PlayerContextType["playerVolume"]>(PLAYER_VOLUME_DEFAULT);
  const [queue, setQueue] = useState<PlayerContextType["queue"]>([]);
  const [logs, setLogs] = useState<PlayerContextType["logs"]>([]);


  /** Pauses/resumes the current video. */
  const pauseResumeCurrentVideo = useCallback((action: "resume" | "pause") => {
    if (!currentVideo || !socketInstance.id) return;

    const req: PlayPauseRequest = {
      clientId: socketInstance.id,
      isPlaying: action === "pause" ? false : true
    };

    const resCallback = (ack: WSAcknowledgement) => {
      if (!ack.success) {
        toast({
          title: `Cannot ${action} video`,
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }

    socketInstance.emit(SOCKET_EVENT_KEYS.setIsPlaying, req, resCallback);

  }, [currentVideo, socketInstance, toast]);


  /** Starts the player with the provided video. */
  const playVideo = useCallback((video: Video) => {
    if (!socketInstance.id) return;

    const req: VideoRequest = {
      clientId: socketInstance.id,
      video
    };

    const resCallback = (ack: WSAcknowledgement) => {
      if (!ack.success) {
        toast({
          title: "Cannot play video",
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }

    socketInstance.emit(SOCKET_EVENT_KEYS.setCurrentVideo, req, resCallback);

  }, [socketInstance, toast]);


  /** Updates the queue with the provided video. */
  const addToTopOfQueue = useCallback((video: Video, action: "add" | "move") => {
    if (!socketInstance.id) return;

    const req: VideoRequest = {
      clientId: socketInstance.id,
      video
    };

    const resCallback = (ack: WSAcknowledgement) => {
      if (ack.success) {
        toast({
          title: `Playing "${replaceHtmlEntities(truncateString(video.title, 40))}" next`,
          ...queueToastProps
        });
      } else {
        toast({
          title: action === "add" ? `Unable to add "${replaceHtmlEntities(truncateString(video.title, 40))}" to the queue` : `Unable to move "${replaceHtmlEntities(truncateString(video.title, 40))}" to the top`,
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }
    socketInstance.emit(SOCKET_EVENT_KEYS.addToTopOfQueue, req, resCallback);

  }, [socketInstance, toast]);


  /** Adds the provided video to the end of the queue. */
  const addToBottomOfQueue = useCallback((video: Video, action: "add" | "move") => {
    if (!socketInstance.id) return;

    const req: VideoRequest = {
      clientId: socketInstance.id,
      video
    };

    const resCallback = (ack: WSAcknowledgement) => {
      if (ack.success) {
        toast({
          title: action === "add" ? `Added "${replaceHtmlEntities(truncateString(video.title, 40))}" to the end of queue` : `Moved "${replaceHtmlEntities(truncateString(video.title, 40))}" to the end of queue`,
          ...queueToastProps
        });
      } else {
        toast({
          title: action === "add" ? `Unable to add "${replaceHtmlEntities(truncateString(video.title, 40))}" to the queue` : `Unable to move "${replaceHtmlEntities(truncateString(video.title, 40))}" to the bottom`,
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }

    socketInstance.emit(SOCKET_EVENT_KEYS.addToBottomOfQueue, req, resCallback);

  }, [socketInstance, toast]);


  /** Triggers the player to retrieve and start the next video (if any) from the queue. */
  const playNextQueueItem = useCallback(() => {
    if (!socketInstance.id) return;

    const req: BaseRequest = { clientId: socketInstance.id }

    const resCallback = (ack: WSAcknowledgement) => {
      if (!ack.success) {
        toast({
          title: "Cannot next play video",
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }

    socketInstance.emit(SOCKET_EVENT_KEYS.playNextQueueItem, req, resCallback);

  }, [socketInstance, toast]);


  const clearQueue = useCallback(() => {
    if (queue.length === 0 || !socketInstance.id) return;

    const req: BaseRequest = { clientId: socketInstance.id }

    const resCallback = (ack: WSAcknowledgement) => {
      if (!ack.success) {
        toast({
          title: "Cannot clear queue",
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }

    socketInstance.emit(SOCKET_EVENT_KEYS.clearQueue, req, resCallback);

  }, [queue.length, socketInstance, toast]);


  /** Deletes the specified video from the queue. */
  const deleteQueueItem = useCallback((videoId: Video["videoId"]) => {
    if (!socketInstance.id) return;

    const req: RemoveQueueItemRequest = {
      clientId: socketInstance.id,
      videoId
    }

    const resCallback = (ack: WSAcknowledgement) => {
      if (!ack.success) {
        toast({
          title: "Cannot remove video from the queue",
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }

    socketInstance.emit(SOCKET_EVENT_KEYS.deleteQueueItem, req, resCallback);

  }, [socketInstance, toast]);


  /** Set the volume of the player. */
  const updatePlayerTimestamp = useCallback((time: number) => {
    if (!currentVideo || !socketInstance.id) return;

    const req: UpdatePlayerTimestampRequest = {
      clientId: socketInstance.id,
      timestamp: time
    }

    const resCallback = (ack: WSAcknowledgement) => {
      if (!ack.success) {
        toast({
          title: "Cannot change video progress",
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }

    socketInstance.emit(SOCKET_EVENT_KEYS.setCurrentVideoTime, req, resCallback);

  }, [currentVideo, socketInstance, toast]);


  /** Set the volume of the player. */
  const updatePlayerVolume = useCallback((volLevel: number) => {
    if (!currentVideo || !socketInstance.id) return;


    const req: UpdatePlayerVolumeRequest = {
      clientId: socketInstance.id,
      volumeLevel: volLevel
    }

    const resCallback = (ack: WSAcknowledgement) => {
      if (!ack.success) {
        toast({
          title: "Cannot change video volume",
          description: ack.errorMessage,
          ...errorToastProps
        });
      }
    }

    socketInstance.emit(SOCKET_EVENT_KEYS.setPlayerVolume, req, resCallback);

  }, [currentVideo, socketInstance, toast]);


  /**
   * Automiatically sync the various states from the server when the socket connects/reconnects.
   * This is achieved by including the variable `previousIsConnected` in the dependancy array to retrigger the `isConnected` check.
   */
  useEffect(() => {
    if (isConnected) {

      // Sync current video state
      socketInstance.on(SOCKET_EVENT_KEYS.currentVideo, (incomingVideo: Video | undefined) => {
        if (currentVideo?.videoId !== incomingVideo?.videoId) {
          console.info("current video synced");
          setCurrentVideo(incomingVideo);
          updateHistory();
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
          console.info("Time synced");
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


      /** Handle any info messages from the player. **CURRENTLY NOT IMPLEMENTED ON SERVER**.*/
      // socketInstance.on(SOCKET_EVENT_KEYS.info, (info: InfoAcknowledgment) => {
      //   if (!toast.isActive(toastIds.playerError)) {
      //     toast({
      //       title: info.title,
      //       description: info.description,
      //       ...infoToastProps
      //     });
      //   }
      // });


      // Sync queue
      socketInstance.on(SOCKET_EVENT_KEYS.queue, (incomingQueue: Video[]) => {
        console.info("queue synced");
        setQueue(incomingQueue);
      });


      // Sync logs
      socketInstance.on(SOCKET_EVENT_KEYS.logs, (incomingLogs: EntryLog[]) => {
        console.info("logs synced");
        setLogs(incomingLogs);
      });


      // Sync loading state
      socketInstance.on(SOCKET_EVENT_KEYS.isLoading, (loading: boolean) => {
        setIsPlayerLoading(loading);
        if (loading) document.title = "Loading...";
      });


      // Sync playing state
      socketInstance.on(SOCKET_EVENT_KEYS.isPlaying, (incomingIsPlaying: boolean) => {
        if (isPlaying !== incomingIsPlaying) {
          console.info("isPlaying synced");
          setIsPlaying(incomingIsPlaying);
        }
      });


      // Sync player volume state
      socketInstance.on(SOCKET_EVENT_KEYS.playerVolume, (incomingVolume: number) => {
        if (incomingVolume !== volume) {
          console.info("volume synced");
          setVolume(incomingVolume);
        }
      });
    }


    return () => {
      socketInstance.off(SOCKET_EVENT_KEYS.currentVideo);
      socketInstance.off(SOCKET_EVENT_KEYS.currentVideoTime);
      socketInstance.off(SOCKET_EVENT_KEYS.error);
      socketInstance.off(SOCKET_EVENT_KEYS.queue);
      socketInstance.off(SOCKET_EVENT_KEYS.isLoading);
      socketInstance.off(SOCKET_EVENT_KEYS.isPlaying);
      socketInstance.off(SOCKET_EVENT_KEYS.playerVolume);
      socketInstance.off(SOCKET_EVENT_KEYS.logs);
    }
  }, [previousIsConnected, isConnected, currentVideo?.videoId, isPlaying, updatePlayerVolume, socketInstance, toast, volume, currentVideo, currentVideoTime, updateHistory]);


  const playerContext: PlayerContextType = useMemo(() => {
    return {
      clearQueue,
      currentVideo,
      currentVideoTime,
      deleteQueueItem,
      error,
      isConnected,
      isPlaying,
      isPlayerLoading,
      pauseResumeCurrentVideo,
      playVideo,
      logs,
      playNextQueueItem,
      addToTopOfQueue,
      addToBottomOfQueue,
      playerVolume: volume,
      queue,
      updatePlayerVolume,
      updatePlayerTimestamp
    }
  }, [clearQueue, currentVideo, currentVideoTime, deleteQueueItem, error, isConnected, isPlaying, isPlayerLoading, pauseResumeCurrentVideo, playVideo, logs, playNextQueueItem, addToTopOfQueue, addToBottomOfQueue, volume, queue, updatePlayerVolume, updatePlayerTimestamp]);

  return (
    <PlayerContext.Provider value={playerContext}>
      {children}
    </PlayerContext.Provider>
  )
}

/** An easy hook to allow access to the current player context, values, and its functions. */
export const usePlayer = (): PlayerContextType => useContext(PlayerContext);