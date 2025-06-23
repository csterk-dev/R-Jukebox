import { HStack, IconButton, StackProps } from "@chakra-ui/react"
import { FC, memo, useCallback, useMemo } from "react"
import { HiBackward, HiForward, HiPause, HiPlay } from "react-icons/hi2";


type VideoControlsProps = StackProps & {
  disableBackButton: boolean,
  disablePlayButton: boolean,
  disableQueueButton: boolean,
  isPlaying: boolean;
  playNextQueueItem: () => void,
  pauseCurrentVideo: () => void,
  resumeCurrentVideo: () => void,
  updateCurrentVideoTime: (time: number) => void,
}

const _VideoControls: FC<VideoControlsProps> = ({ disableBackButton, disablePlayButton, disableQueueButton, isPlaying, playNextQueueItem, pauseCurrentVideo, resumeCurrentVideo, updateCurrentVideoTime, ...props }) => {
  const playPauseIcon = useMemo(() => isPlaying ? <HiPause /> : <HiPlay />, [isPlaying]);

  /** Handles the toggling of the player playback. */
  const onPressPlayPause = useCallback(() => {
    if (disablePlayButton) return;
    if (isPlaying) return pauseCurrentVideo();
    resumeCurrentVideo();
  }, [disablePlayButton, isPlaying, pauseCurrentVideo, resumeCurrentVideo]);


  const _updateCurrentVideoTime = useCallback(() => updateCurrentVideoTime(0), [updateCurrentVideoTime]);

  return (
    <HStack justifyContent="center" {...props}>
      <IconButton
        aria-label="rewind"
        icon={<HiBackward />}
        isDisabled={disableBackButton}
        size="md"
        onClick={_updateCurrentVideoTime}
      />
      <IconButton
        aria-label="play/pause"
        icon={playPauseIcon}
        isDisabled={disablePlayButton}
        size="md"
        onClick={onPressPlayPause}
      />
      <IconButton
        aria-label="forward"
        icon={<HiForward />}
        isDisabled={disableQueueButton}
        size="md"
        onClick={playNextQueueItem}
      />
    </HStack>
  );
}
_VideoControls.displayName = "VideoControls";

/**
 * Renders the prev, next and play/pause buttons.
 * @extends FlexProps Additional props to configure the parent container.
 * @returns {JSX.Element} The controls.
 */
export const VideoControls = memo(_VideoControls);