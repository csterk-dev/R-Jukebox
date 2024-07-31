import { Flex, FlexProps, HStack, Icon, IconButton, Image, Spacer, Tag, Text, Tooltip, useColorModeValue, VStack } from "@chakra-ui/react";
import { useWebHover } from "@usesoftwareau/react-utils";
import { FC, memo, useCallback, useMemo } from "react";
import { HiBarsArrowDown, HiQueueList, HiSignal } from "react-icons/hi2";
import { ISO8601ToSeconds, replaceHtmlEntities, videoDurationToString, videoPublishedDateToString } from "utils/misc";

/** Enable when queue is implemented */
const SHOW_OPTIONS = false;

type VideoCardProps = FlexProps & {
  isMobile: boolean;
  video: Video;
  playVideo: (video: Video) => void;
}

const _VideoCard: FC<VideoCardProps> = ({ isMobile, video, playVideo, ...props }) => {
  const foreground = useColorModeValue("neutral.white", "neutral.900");
  const optionButtonBg = useColorModeValue("neutral.white", "neutral.900");
  
  const videoDuration = useMemo(() => videoDurationToString(ISO8601ToSeconds(video.duration)), [video?.duration]);
  const videoPublishedAt = useMemo(() => videoPublishedDateToString(video.publishedAt), [video.publishedAt]);
  const videoTitle = useMemo(() => replaceHtmlEntities(video.title), [video.title]);
  
  const isLive = videoDuration === "Live";


  const [cardRef, cardHovered] = useWebHover();
  const [buttonRef, buttonHovered] = useWebHover();


  const isHovered = useMemo(() => {
    if (cardHovered || buttonHovered) return true;
    return false;
  }, [buttonHovered, cardHovered]);


  const onClickCard = useCallback(() => {
    playVideo(video);
  }, [playVideo, video]);


  return (
    <Flex
      _hover={{ cursor: "pointer" }}
      // bgColor={isHovered ? foregroundHovered : foreground}
      bgColor={foreground}
      borderRadius={5}
      boxShadow="base"
      flexDir="row"
      height="94px"
      position="relative"
      ref={cardRef}
      width="100%"
      onClick={onClickCard}
      {...props}
    >
      <Flex
        borderRadius={5}
        filter="auto"
        height="94px"
        position="relative"
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
        <Tag
          alignItems="center"
          bgColor={isLive ? "red.500" : foreground}
          borderRadius={2}
          bottom="4px"
          color={isLive ? "white" : undefined}
          fontSize="14"
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
        borderRadius={10}
        flex={1}
        flexDir="column"
        justifyContent="space-between"
        px="10px"
        py="5px"
      >
        <Text
          as="h4"
          fontSize="14"
          fontWeight="600"
          noOfLines={2}
          textOverflow="ellipsis"
        >
          {videoTitle}
        </Text>
        <Text fontSize="14" noOfLines={1} textOverflow="ellipsis">
          {video.channelTitle}
        </Text>
        <HStack fontSize="14" fontWeight="400">
          {/* <Text>
            Unknown Views
          </Text>
          <Text>
            •
          </Text> */}
          <Text>
            {videoPublishedAt}
          </Text>
        </HStack>

      </Flex>

      {isHovered && SHOW_OPTIONS ?
        <HStack
          gap="5px"
          height="100%"
          justifyContent="center"
          // pl="60px"
          position="absolute"
          pr="5px"
          ref={buttonRef}
          width="100%"
          zIndex={100}
        >
          {/* <IconButton
            _hover={{
              bgColor: "purple.500",
              color: "white",
              transition: "all linear 0ms "
            }}
            aria-label="Play video"
            bg="white"
            color="neutral.700"
            icon={<HiPlay size="20px" />}
            variant="solid"
          /> */}
          <Spacer />
          <VStack>
            <Tooltip label="Play next" placement="left">
              <IconButton
                _hover={{
                  transition: "all linear 0ms "
                }}
                aria-label="Play video next"
                bgColor={optionButtonBg}
                icon={<HiQueueList />}
                variant="solid"
              />
            </Tooltip>
            <Tooltip label="Play last" placement="left">
              <IconButton
                _hover={{
                  transition: "all linear 0ms "
                }}
                aria-label="Play video last"
                bgColor={optionButtonBg}
                icon={<HiBarsArrowDown />}
                variant="solid"
              />
            </Tooltip>
          </VStack>
        </HStack> :
        null
      }
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