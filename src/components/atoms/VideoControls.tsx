import { Flex, FlexProps, IconButton, Tooltip } from "@chakra-ui/react"
import { FC, memo, useCallback } from "react"
import { HiBackward, HiForward, HiPause, HiPlay } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";

type VideoControlsProps = FlexProps & {}

const _VideoControls: FC<VideoControlsProps> = ({ ...props }) => {
  const openDelay = 500;

  const { isPlaying, pauseCurrentVideo, resumeCurrentVideo } = usePlayer();

  const onPressPlayPause = useCallback(() => {
    console.log(isPlaying);
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
        <Tooltip label="Restart song" openDelay={openDelay}>
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
        <Tooltip label="Next song" openDelay={openDelay}>
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