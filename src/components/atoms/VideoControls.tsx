import { Flex, FlexProps, IconButton, Tooltip } from "@chakra-ui/react"
import { TooltipOpenDelay } from "../../constants";
import { FC, memo, useCallback, useMemo } from "react"
import { HiBackward, HiForward, HiPause, HiPlay } from "react-icons/hi2";

/** Set false when previous and next functionality is implemented. */
const DISABLE_PREV_NEXT = true;


type VideoControlsProps = FlexProps & {
  disableButtons: boolean,
  isPlaying: boolean;
  pauseCurrentVideo: () => void,
  resumeCurrentVideo: () => void,
  updateCurrentVideoTime: (time: number) => void,
}

const _VideoControls: FC<VideoControlsProps> = ({ disableButtons, isPlaying, pauseCurrentVideo, resumeCurrentVideo, updateCurrentVideoTime, ...props }) => {
  const playPauseIcon = useMemo(() => isPlaying ? <HiPause /> : <HiPlay />, [isPlaying]);


  /** Handles the toggling of the player playback. */
  const onPressPlayPause = useCallback(() => {
    if (disableButtons) return;
    if (isPlaying) return pauseCurrentVideo();
    resumeCurrentVideo();
  }, [disableButtons, isPlaying, pauseCurrentVideo, resumeCurrentVideo]);


  const _updateCurrentVideoTime = useCallback(() => updateCurrentVideoTime(0), [updateCurrentVideoTime]);

  return (
    <Flex cursor={!disableButtons ? "not-allowed" : undefined} justifyContent="center" {...props}>
      <Flex alignItems="center" gap="5px" zIndex={100}>
        <IconButton
          aria-label="rewind"
          icon={<HiBackward />}
          isDisabled={disableButtons}
          variant="ghost"
          onClick={_updateCurrentVideoTime}
        />
        <IconButton
          aria-label="play/pause"
          icon={playPauseIcon}
          isDisabled={disableButtons}
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