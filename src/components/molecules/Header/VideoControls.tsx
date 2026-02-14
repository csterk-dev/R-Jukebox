import { HStack, IconButton, StackProps } from "@chakra-ui/react"
import { FC, memo, useMemo } from "react"
import { HiBackward, HiForward, HiPause, HiPlay } from "react-icons/hi2";


type VideoControlsProps = StackProps & {
  disableRewindButton: boolean,
  disablePlayButton: boolean,
  disableQueueButton: boolean,
  isPlaying: boolean;
  onPressRewindToStart(): void;
  onPressPlayPause(): void;
  onPressPlayNextQueueItem(): void;
}

const _VideoControls: FC<VideoControlsProps> = ({ disableRewindButton: disableBackButton, disablePlayButton, disableQueueButton, isPlaying, onPressPlayPause, onPressRewindToStart, onPressPlayNextQueueItem, ...props }) => {
  const playPauseIcon = useMemo(() => isPlaying ? <HiPause /> : <HiPlay />, [isPlaying]);

  return (
    <HStack justifyContent="center" {...props}>
      <IconButton
        aria-label="rewind"
        disabled={disableBackButton}
        size="md"
        onClick={onPressRewindToStart}
      >
        <HiBackward />
      </IconButton>
      <IconButton
        aria-label={isPlaying ? "Pause player" : "Resume player"}
        disabled={disablePlayButton}
        size="md"
        onClick={onPressPlayPause}
      >
        {playPauseIcon}
      </IconButton>
      <IconButton
        aria-label="forward"
        disabled={disableQueueButton}
        size="md"
        onClick={onPressPlayNextQueueItem}
      >
        <HiForward />
      </IconButton>
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