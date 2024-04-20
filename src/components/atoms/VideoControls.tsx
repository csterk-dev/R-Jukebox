import { Flex, FlexProps, IconButton, Tooltip } from "@chakra-ui/react"
import { FC, memo, useCallback } from "react"
import { HiBackward, HiForward, HiPause, HiPlay } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";


const tooltipOpenDelay = 500;


type VideoControlsProps = FlexProps & {}


const _VideoControls: FC<VideoControlsProps> = ({ ...props }) => {

  /*
   * Get the current state of the player
   */
  const { isPlaying, pauseCurrentVideo, resumeCurrentVideo } = usePlayer();

  /**
   * Toggles the current playing state of the player.
   */
  const onPressPlayPause = useCallback(() => {
    if (isPlaying) return pauseCurrentVideo();
    resumeCurrentVideo();
  }, [isPlaying, pauseCurrentVideo, resumeCurrentVideo]);

  
  return (
    <Flex justifyContent="center" {...props}>
      <Flex
        alignItems="center"
        gap="5px"
        zIndex={100}
      >
        <Tooltip label="Restart song" openDelay={tooltipOpenDelay}>
          <IconButton
            aria-label="rewind"
            colorScheme="purple"
            icon={<HiBackward />}
            variant="ghost"
            isDisabled
          />
        </Tooltip>
        <IconButton
          aria-label="play/pause"
          colorScheme="purple"
          icon={isPlaying ? <HiPause /> : <HiPlay />}
          variant="ghost"
          onClick={onPressPlayPause}
        />
        <Tooltip label="Next song" openDelay={tooltipOpenDelay}>
          <IconButton
            aria-label="forward"
            colorScheme="purple"
            icon={<HiForward />}
            variant="ghost"
            isDisabled
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
_VideoControls.displayName = "VideoControls";

export const VideoControls = memo(_VideoControls);