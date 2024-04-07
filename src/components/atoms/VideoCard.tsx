import { Flex, FlexProps, HStack, IconButton, Image, Spacer, Text, useColorModeValue } from "@chakra-ui/react";
import { useWebHover } from "@usesoftwareau/react-utils";
import { FC, memo, useMemo } from "react";
import { HiPlay } from "react-icons/hi2";
import { formatVideoDuration, formatVideoPublishedDate, replaceAmps } from "utils/misc";


type VideoCardProps = FlexProps & {
  video: YoutubeVideo;
}

const _VideoCard: FC<VideoCardProps> = ({ video, ...props }) => {
  const foreground = useColorModeValue("neutral.white", "neutral.900");

  const videoDuration = formatVideoDuration(video?.contentDetails.duration);
  const videoPublishedAt = formatVideoPublishedDate(video?.video.snippet.publishedAt);
  const videoTitle = replaceAmps(video?.video.snippet.title);

  const [cardRef, cardHovered] = useWebHover();
  const [buttonRef, buttonHovered] = useWebHover();

  const showOverlay = useMemo(() => {
    if (cardHovered || buttonHovered) return true;
    return false;
  }, [buttonHovered, cardHovered]);

  return (
    <Flex
      // _hover={{ cursor: "pointer" }}
      bgColor={foreground}
      borderRadius={5}
      boxShadow="base"
      flexDir="row"
      height="94px"
      position="relative"
      ref={cardRef}
      width="100%"
      {...props}
    >
      <Flex
        borderRadius={5}
        /* Must specify filter property before blur can be specified */
        filter="auto"
        height="94px"
        position="relative"
        // eslint-disable-next-line react/jsx-sort-props
        blur={showOverlay ? "4px" : undefined}
      >
        <Image
          aria-label="Video thumbnail"
          borderRadius={5}
          height="94px"
          objectFit="cover"
          src={video?.video.snippet.thumbnails.high.url}
          width="168px"
        />
        <Text
          bgColor={foreground}
          borderRadius={4}
          bottom="4px"
          fontSize="14"
          position="absolute"
          px="4px"
          right="2px"
          textAlign="center"
        >
          {videoDuration}
        </Text>
      </Flex>

      <Flex
        borderRadius={10}
        /* Must specify filter property before blur can be specified */
        filter="auto"
        flex={1}
        flexDir="column"
        justifyContent="space-between"
        px="10px"
        py="5px"
        // eslint-disable-next-line react/jsx-sort-props
        // blur={showOverlay ? "4px" : undefined}
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
          {video?.video.snippet.channelTitle}
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

      {showOverlay ?
        <HStack
          height="100%"
          justifyContent="center"
          pl="65px"
          position="absolute"
          pr="20px"
          pt="3px"
          ref={buttonRef}
          width="100%"
          zIndex={100}
        >
          <IconButton
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
          />
          <Spacer />
          {/* <VStack
            _hover={{
              transition: "all linear 0ms "
            }}
          >
            <Tooltip label="Play next" placement="left">
              <IconButton
                aria-label="Play video next"
                icon={<HiQueueList />}
                variant="ghost"
              />
            </Tooltip>
            <Tooltip label="Play last" placement="left">
              <IconButton
                aria-label="Play video last"
                icon={<HiBarsArrowDown />}
                variant="ghost"
              />
            </Tooltip>
          </VStack> */}
        </HStack> :
        null
      }

    </Flex>
  )
}
_VideoCard.displayName = "VideoCard";

export const VideoCard = memo(_VideoCard);