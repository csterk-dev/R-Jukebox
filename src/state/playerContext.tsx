import { logAxiosError } from "@usesoftwareau/react-utils";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { PlayerAPI } from "utils/api";


interface PlayerContextType {
  currentVideo: YoutubeVideo;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | undefined;
  pauseCurrentVideo: () => void;
  playVideo: (video: YoutubeVideo) => void;
  resumeCurrentVideo: () => void;
}

const defaultPlayerContextVal: PlayerContextType = {
  currentVideo: undefined,
  isPlaying: false,
  isLoading: false,
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
  const [currentVideo, setCurrentVideo] = useState<PlayerContextType["currentVideo"]>(undefined);
  const [isPlaying, setIsPlaying] = useState<PlayerContextType["isPlaying"]>(false);
  const [isLoading, setIsLoading] = useState<PlayerContextType["isLoading"]>(false);
  const [error, setError] = useState<string>();

  /** Plays the supplied video. */
  const playVideo = useCallback((video: YoutubeVideo) => {
    if (!video) return;

    setIsLoading(true);

    const playPromise = PlayerAPI.playVideo(video.video.id.videoId);
    playPromise
      .then(() => {
        setCurrentVideo(video)
        setIsPlaying(true);
        setError(undefined);
      })
      .catch((err) => {
        console.log("Error playing video");
        logAxiosError(err);
        setError(err.message);
      })
      .finally((() => {
        setIsLoading(false);
      }))

  }, []);

  /** Pauses the currently playing video. */
  const pauseCurrentVideo = useCallback(() => {
    if (!currentVideo) return;

    setIsLoading(true);

    const playPromise = PlayerAPI.pauseVideo(currentVideo.video.id.videoId);
    playPromise
      .then((() => {
        setIsPlaying(false);
        setError(undefined);
      }))
      .catch((err) => {
        console.log("Error playing video");
        logAxiosError(err);
        setError(err.message);
      })
      .finally((() => {
        setIsLoading(false);
      }))
  }, [currentVideo]);

  /** Pauses the currently playing video. */
  const resumeCurrentVideo = useCallback(() => {
    if (!currentVideo) return;

    setIsLoading(true);

    const playPromise = PlayerAPI.playVideo(currentVideo.video.id.videoId);
    playPromise
      .then(() => {
        setIsPlaying(true);
        setError(undefined);
      })
      .catch((err) => {
        console.log("Error playing video");
        logAxiosError(err);
        setError(err.message);
      })
      .finally((() => {
        setIsLoading(false);
      }))

  }, [currentVideo]);

  const playerContext: PlayerContextType = useMemo(() => {
    return {
      currentVideo,
      isPlaying,
      isLoading,
      error,
      pauseCurrentVideo,
      playVideo,
      resumeCurrentVideo
    }
  }, [currentVideo, error, isLoading, isPlaying, pauseCurrentVideo, playVideo, resumeCurrentVideo]);

  return (
    <PlayerContext.Provider value={playerContext}>
      {children}
    </PlayerContext.Provider>
  )
}

/** Allows access to the current player context values and functions. */
export const usePlayer = (): PlayerContextType => useContext(PlayerContext);