import { Box, Flex, FlexProps, HStack, Icon, IconButton, Image, Menu, Portal, Tag, Text, VStack } from "@chakra-ui/react";
import { useWebHover } from "@usesoftwareau/react-utils";
import { FC, memo, useCallback, useMemo } from "react";
import { HiBarsArrowDown, HiEllipsisVertical, HiQueueList, HiSignal } from "react-icons/hi2";
import { ISO8601ToSeconds, replaceHtmlEntities, videoDurationToString, videoPublishedDateToString } from "@utils";
import { Tooltip } from "@ui";

type VideoCardProps = FlexProps & {
  isMobile: boolean;
  video: Video;
  playVideo: (video: Video) => void;
  addToBottomOfQueue: () => void;
  addToTopOfQueue: () => void;

}

const _VideoCard: FC<VideoCardProps> = ({ isMobile, video, playVideo, addToBottomOfQueue, addToTopOfQueue, ...props }) => {

  const videoDuration = useMemo(() => videoDurationToString(ISO8601ToSeconds(video.duration)), [video?.duration]);
  const videoPublishedAt = useMemo(() => videoPublishedDateToString(video.publishedAt), [video.publishedAt]);
  const videoTitle = useMemo(() => replaceHtmlEntities(video.title), [video.title]);

  const isLive = videoDuration === "Live";
  const [cardRef, cardHovered] = useWebHover();


  const onClickPlay = useCallback(() => {
    if (!isLive) playVideo(video);
  }, [isLive, playVideo, video]);
  const onClickNext = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addToTopOfQueue();
  }, [addToTopOfQueue]);
  const onClickLast = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addToBottomOfQueue();
  }, [addToBottomOfQueue]);


  return (
    <Flex
      _hover={{ cursor: isLive ? "not-allowed" : "pointer" }}
      bg="surface.foreground"
      borderRadius="sm"
      boxShadow="base"
      flexDir="row"
      height="94px"
      opacity={isLive ? 0.5 : 1}
      position="relative"
      ref={cardRef}
      width="100%"
      {...props}
    >
      <Flex
        borderLeftRadius="sm"
        filter="auto"
        height="94px"
        position="relative"
        onClick={onClickPlay}
      >
        <Image
          aria-label="Video thumbnail"
          borderLeftRadius={5}
          height="94px"
          objectFit="cover"
          pointerEvents="none"
          src={video.thumbnails.medium.url}
          width={{
            sm: "130px",
            md: "168px"
          }}
        // width={isMobile ? "130px" : "168px"}
        />
        {cardHovered && !isMobile ?
          <VStack gap="2px" position="absolute" right="2px">
            <Tooltip content="Play next" positioning={{ placement: "left" }}>
              <IconButton
                _hover={{
                  transition: "all linear 0ms "
                }}
                aria-label="Play video next"
                bgColor="rgba(0,0,0, 0.8)"
                color="white"
                disabled={isLive}
                fontSize="16px"
                variant="solid"
                onClick={onClickNext}
              >
                <HiQueueList />
              </IconButton>
            </Tooltip>
            <Tooltip content="Play last" positioning={{ placement: "left" }}>
              <IconButton
                _hover={{
                  transition: "all linear 0ms "
                }}
                aria-label="Play video last"
                bgColor="rgba(0,0,0, 0.8)"
                color="white"
                disabled={isLive}
                fontSize="16px"
                variant="solid"
                onClick={onClickLast}
              >
                <HiBarsArrowDown />
              </IconButton>
            </Tooltip>
          </VStack> :
          null
        }
        <Tag.Root
          alignItems="center"
          bgColor={isLive ? "red.500" : "rgba(0,0,0, 0.6)"}
          borderRadius="xs"
          bottom="2px"
          color="white"
          fontSize="14"
          fontWeight="semibold"
          lineHeight="short"
          position="absolute"
          px="4px"
          right="2px"
          textAlign="center"
          variant="solid"
        >
          {isLive ? <Icon as={HiSignal} mr="2px" /> : null}
          {videoDuration}
        </Tag.Root>
      </Flex>

      <Flex
        borderEndRadius="sm"
        flex={1}
        flexDir="column"
        justifyContent="space-between"
        px={2.5}
        py="5px"
        onClick={onClickPlay}
      >
        <Text
          as="h1"
          fontSize="sm"
          fontWeight="semibold"
          lineClamp={2}
          textOverflow="ellipsis"
        >
          {videoTitle}
        </Text>
        <Text fontSize="xs" lineClamp={1} textOverflow="ellipsis">
          {video.channelTitle}
        </Text>
        <HStack>
          {/* <Text>
            Unknown Views
          </Text>
          <Text>
            •
          </Text> */}
          <Text fontSize="xs">
            {videoPublishedAt}
          </Text>
        </HStack>
      </Flex>

      <Flex flexDirection="column" height="100%">
        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton aria-label="More options" colorPalette="brand" variant="tertiary">
              <HiEllipsisVertical />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item disabled={isLive} value="next" onSelect={addToTopOfQueue}>
                  <HiQueueList />
                  Play Next
                </Menu.Item>
                <Menu.Item disabled={isLive} value="last" onClick={addToBottomOfQueue}>
                  <HiBarsArrowDown />
                  Play Last
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  )
}
_VideoCard.displayName = "VideoCard";

/**
 * Displays the video details in a card.
 * 
 * @extends FlexProps Additional props to configure the card container.
 * @returns {JSX.Element} The video card.
 */
export const VideoCard = memo(_VideoCard);



export const VidoeCardSkeleton: FC<FlexProps> = (props) => (
  <Flex
    bg="surface.foreground"
    borderRadius="sm"
    boxShadow="base"
    flexDir="row"
    height="94px"
    width="100%"
    {...props}
  >
    <Flex
      bg="surface.foreground"
      borderLeftRadius="sm"
      filter="auto"
      height="94px"
      position="relative"
      width="168px"
    />

    <Flex
      borderEndRadius="sm"
      flex={1}
      flexDir="column"
      justifyContent="space-between"
      px={2.5}
      py="5px"
    >
      <Box
        bg="surface.foreground"
        borderRadius="lg"
        h="12px"
        w="180px"
      />
      <Box
        bg="surface.foreground"
        borderRadius="lg"
        h="8px"
        w="100px"
      />
      <Box
        bg="surface.foreground"
        borderRadius="lg"
        h="8px"
        w="130px"
      />
    </Flex>

    <Flex
      borderEndRadius="sm"
      flex={1}
      flexDir="column"
      px={2.5}
      py="5px"
    >
      <Box
        bg="surface.foreground"
        borderRadius="lg"
        h="12px"
        w="12px"
      />
    </Flex>
  </Flex>
);
VidoeCardSkeleton.displayName = "VidoeCardSkeleton";