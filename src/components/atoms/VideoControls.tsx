import { Flex, FlexProps, IconButton, Tooltip } from "@chakra-ui/react"
import { FC, memo } from "react"
import { HiBackward, HiForward, HiPlay } from "react-icons/hi2";

type VideoControlsProps = FlexProps & {}

const _VideoControls: FC<VideoControlsProps> = ({ ...props }) => {
  const openDelay = 500;

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
          />
        </Tooltip>
        <IconButton
          aria-label="play/pause"
          colorScheme="purple"
          icon={<HiPlay />}
          variant="ghost"
        />
        <Tooltip label="Next song" openDelay={openDelay}>
          <IconButton
            aria-label="forward"
            colorScheme="purple"
            icon={<HiForward />}
            variant="ghost"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}
_VideoControls.displayName = "VideoControls";

export const VideoControls = memo(_VideoControls);