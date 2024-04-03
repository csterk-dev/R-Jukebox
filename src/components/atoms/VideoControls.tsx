import { Flex, FlexProps, IconButton } from "@chakra-ui/react"
import { FC, memo } from "react"
import { HiBackward, HiForward, HiPlay } from "react-icons/hi2";

type VideoControlsProps = FlexProps & {}

const _VideoControls: FC<VideoControlsProps> = ({ ...props }) => {

  return (
    <Flex justifyContent="center" {...props}>
      <Flex
        alignItems="center"
        gap="5px"
        zIndex={100}
      >
        <IconButton
          aria-label="rewind"
          colorScheme="purple"
          icon={<HiBackward />}
          variant="ghost"
        />
        <IconButton
          aria-label="play/pause"
          colorScheme="gray"
          icon={<HiPlay />}
          variant="solid"
        />
        <IconButton
          aria-label="forward"
          colorScheme="purple"
          icon={<HiForward />}
          variant="ghost"
        />
      </Flex>
    </Flex>
  );
}
_VideoControls.displayName = "VideoControls";

export const VideoControls = memo(_VideoControls);