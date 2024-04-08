import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";


interface PlayerContextType {
  currentVideo: YoutubeVideo;
  isPlaying: boolean;
  isLoading: boolean;
  pauseCurrentVideo: () => void;
  playVideo: (video: YoutubeVideo) => void;
  resumeCurrentVideo: () => void;
}

const defaultPlayerContextVal: PlayerContextType = {
  currentVideo: undefined,
  isPlaying: false,
  isLoading: false,
  pauseCurrentVideo: () => void 0,
  playVideo: () => void 0,
  resumeCurrentVideo: () => void 0
};


const PlayerContext = createContext<PlayerContextType>(defaultPlayerContextVal);

/**
 * Manage the current video player context.
 */
export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState<PlayerContextType["currentVideo"]>(undefined);
  const [isPlaying, setIsPlaying] = useState<PlayerContextType["isPlaying"]>(false);
  const [isLoading, setIsLoading] = useState<PlayerContextType["isLoading"]>(false);

  /** Pauses the currently playing video. */
  const pauseCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    setIsPlaying(false);

    // Send request to pause playing

  }, [currentVideo]);

  /** Plays the supplied video. */
  const playVideo = useCallback((video: YoutubeVideo) => {
    // Indicate loading

    // Dispatch request with video URI

    /*
     * On success start playing, 
     */

    setCurrentVideo(video)
    setIsPlaying(true);

  }, []);

  /** Pauses the currently playing video. */
  const resumeCurrentVideo = useCallback(() => {
    if (!currentVideo) return;
    setIsPlaying(true);

    // Send request to resume playing

  }, [currentVideo]);

  const playerContext: PlayerContextType = useMemo(() => {
    return {
      currentVideo,
      isPlaying,
      isLoading,
      pauseCurrentVideo,
      playVideo,
      resumeCurrentVideo
    }
  }, [currentVideo, isLoading, isPlaying, pauseCurrentVideo, playVideo, resumeCurrentVideo]);

  return (
    <PlayerContext.Provider value={playerContext}>
      {children}
    </PlayerContext.Provider>
  )
}

/** Allows access to the current player context values and functions. */
export const usePlayer = (): PlayerContextType => useContext(PlayerContext);