import { Flex, FlexProps, HStack, Icon, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Tag, Text, Tooltip, useColorModeValue, VStack } from "@chakra-ui/react";
import { useWebHover } from "@usesoftwareau/react-utils";
import { FC, memo, useCallback, useMemo } from "react";
import { HiBarsArrowDown, HiEllipsisVertical, HiQueueList, HiSignal } from "react-icons/hi2";
import { ISO8601ToSeconds, replaceHtmlEntities, videoDurationToString, videoPublishedDateToString } from "utils/misc";

type VideoCardProps = FlexProps & {
  isMobile: boolean;
  video: Video;
  playVideo: (video: Video) => void;
  addToBottomOfQueue: () => void;
  addToTopOfQueue: () => void;

}

const _VideoCard: FC<VideoCardProps> = ({ isMobile, video, playVideo, addToBottomOfQueue, addToTopOfQueue, ...props }) => {
  const moreActionsIconColor = useColorModeValue("neutral.900", "base.white");

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
      _dark={{ bg: "neutral.900" }}
      _hover={{ cursor: isLive ? "not-allowed" : "pointer" }}
      bg="base.white"
      borderRadius="5px"
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
        borderRadius="5px 0px 0px 5px"
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
          width={isMobile ? "130px" : "168px"}
        />
        {cardHovered && !isMobile ?
          <VStack gap="2px" position="absolute" right="2px">
            <Tooltip label="Play next" placement="left">
              <IconButton
                _hover={{
                  transition: "all linear 0ms "
                }}
                aria-label="Play video next"
                bgColor="rgba(0,0,0, 0.8)"
                color="white"
                fontSize="16px"
                icon={<HiQueueList />}
                isDisabled={isLive}
                variant="solid"
                onClick={onClickNext}
              />
            </Tooltip>
            <Tooltip label="Play last" placement="left">
              <IconButton
                _hover={{
                  transition: "all linear 0ms "
                }}
                aria-label="Play video last"
                bgColor="rgba(0,0,0, 0.8)"
                color="white"
                fontSize="16px"
                icon={<HiBarsArrowDown />}
                isDisabled={isLive}
                variant="solid"
                onClick={onClickLast}
              />
            </Tooltip>
          </VStack> :
          null
        }
        <Tag
          alignItems="center"
          bgColor={isLive ? "red.500" : "rgba(0,0,0, 0.6)"}
          borderRadius={2}
          bottom="2px"
          color="white"
          fontSize="14"
          fontWeight="600"
          position="absolute"
          px="4px"
          right="2px"
          textAlign="center"
        >
          {isLive ? <Icon as={HiSignal} mr="2px" /> : null}
          {videoDuration}
        </Tag>
      </Flex>

      <Flex
        borderRadius="0px 5px 5px 0px"
        flex={1}
        flexDir="column"
        fontSize="12"
        justifyContent="space-between"
        px={2.5}
        py="5px"
        onClick={onClickPlay}
      >
        <Text
          as="h1"
          fontWeight="semibold"
          noOfLines={2}
          textOverflow="ellipsis"
        >
          {videoTitle}
        </Text>
        <Text color="text.body.subtle" noOfLines={1} textOverflow="ellipsis">
          {video.channelTitle}
        </Text>
        <HStack fontWeight="thin">
          {/* <Text>
            Unknown Views
          </Text>
          <Text>
            •
          </Text> */}
          <Text color="text.body.subtle">
            {videoPublishedAt}
          </Text>
        </HStack>
      </Flex>

      <Flex flexDirection="column" height="100%">
        <Menu size="sm">
          <MenuButton
            aria-label="More options"
            as={IconButton}
            color={moreActionsIconColor}
            fontSize="18px"
            icon={<HiEllipsisVertical />}
            size="sm"
            variant="ghost"
          />
          <MenuList>
            <MenuItem icon={<HiQueueList />} isDisabled={isLive} onClick={onClickNext}>
              Play Next
            </MenuItem>
            <MenuItem icon={<HiBarsArrowDown />} isDisabled={isLive} onClick={onClickLast}>
              Play Last
            </MenuItem>
          </MenuList>
        </Menu>
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