import { Flex, FlexProps, IconButton, Tooltip } from "@chakra-ui/react"
import { TooltipOpenDelay } from "../../constants";
import { FC, memo, useCallback, useMemo } from "react"
import { HiBackward, HiForward, HiPause, HiPlay } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";

const showNextPrevButtons = true;


type VideoControlsProps = FlexProps & {}


const _VideoControls: FC<VideoControlsProps> = ({ ...props }) => {

  /*
   * Get the current state of the player
   */
  const { currentVideo, isPlaying, pauseCurrentVideo, resumeCurrentVideo } = usePlayer();

  /**
   * Toggles the current playing state of the player.
   */
  const onPressPlayPause = useCallback(() => {
    if (!currentVideo) return;
    if (isPlaying) return pauseCurrentVideo();
    resumeCurrentVideo();
  }, [currentVideo, isPlaying, pauseCurrentVideo, resumeCurrentVideo]);

  /** The play pause icons */
  const playPauseIcon = useMemo(() => isPlaying ? <HiPause /> : <HiPlay />, [isPlaying]);


  return (
    <Flex justifyContent="center" {...props}>
      <Flex
        alignItems="center"
        gap="5px"
        zIndex={100}
      >
        <Tooltip isDisabled={showNextPrevButtons} label="Restart song" openDelay={TooltipOpenDelay}>
          <IconButton
            aria-label="rewind"
            icon={<HiBackward />}
            isDisabled={showNextPrevButtons}
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
        <Tooltip isDisabled={showNextPrevButtons} label="Next song" openDelay={TooltipOpenDelay}>
          <IconButton
            aria-label="forward"
            icon={<HiForward />}
            isDisabled={showNextPrevButtons}
            variant="ghost"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
_VideoControls.displayName = "VideoControls";

export const VideoControls = memo(_VideoControls);