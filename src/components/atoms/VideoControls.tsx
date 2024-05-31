import { Flex, FlexProps, IconButton, Tooltip } from "@chakra-ui/react"
import { TooltipOpenDelay } from "../../constants";
import { FC, memo, useCallback, useMemo } from "react"
import { HiBackward, HiForward, HiPause, HiPlay } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";

/** Set false when previous and next functionality is implemented. */
const DISABLE_PREV_NEXT = true;


const _VideoControls: FC<FlexProps> = ({ ...props }) => {
  const { currentVideo, isPlaying, pauseCurrentVideo, resumeCurrentVideo } = usePlayer();
  const playPauseIcon = useMemo(() => isPlaying ? <HiPause /> : <HiPlay />, [isPlaying]);


  /** Handles the toggling of the player playback. */
  const onPressPlayPause = useCallback(() => {
    if (!currentVideo) return;
    if (isPlaying) return pauseCurrentVideo();
    resumeCurrentVideo();
  }, [currentVideo, isPlaying, pauseCurrentVideo, resumeCurrentVideo]);


  return (
    <Flex justifyContent="center" {...props}>
      <Flex alignItems="center" gap="5px" zIndex={100}>
        <Tooltip isDisabled={DISABLE_PREV_NEXT} label="Restart song" openDelay={TooltipOpenDelay}>
          <IconButton
            aria-label="rewind"
            icon={<HiBackward />}
            isDisabled={DISABLE_PREV_NEXT}
            variant="ghost"
          />
        </Tooltip>
        <IconButton
          aria-label="play/pause"
          icon={playPauseIcon}
          isDisabled={!currentVideo}
          variant="ghost"
          onClick={onPressPlayPause}
        />
        <Tooltip isDisabled={DISABLE_PREV_NEXT} label="Next song" openDelay={TooltipOpenDelay}>
          <IconButton
            aria-label="forward"
            icon={<HiForward />}
            isDisabled={DISABLE_PREV_NEXT}
            variant="ghost"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
_VideoControls.displayName = "VideoControls";

/**
 * Renders the prev, next and play/pause buttons.
 * @extends FlexProps Additional props to configure the parent container.
 * @returns {JSX.Element} The controls.
 */
export const VideoControls = memo(_VideoControls);