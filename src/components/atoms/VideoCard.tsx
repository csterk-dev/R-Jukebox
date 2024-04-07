import { Flex, FlexProps, HStack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { FC, memo } from "react";
import { formatVideoDuration, formatVideoPublishedDate, replaceAmps } from "utils/misc";


type VideoCardProps = FlexProps & {
  video: YoutubeVideo;
}

const _VideoCard: FC<VideoCardProps> = ({ video, ...props }) => {
  const foreground = useColorModeValue("neutral.white", "neutral.900");

  const videoDuration = formatVideoDuration(video?.contentDetails.duration);
  const videoPublishedAt = formatVideoPublishedDate(video?.video.snippet.publishedAt);
  const videoTitle = replaceAmps(video?.video.snippet.title);
  
  return (
    <Flex
      _hover={{ cursor: "pointer" }}
      bgColor={foreground}
      borderRadius={5}
      boxShadow="base"
      flexDir="row"
      height="94px"
      width="100%"
      {...props}
    >
      <Flex
        borderRadius={5}
        height="94px"
        position="relative"
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
    </Flex>
  )
}
_VideoCard.displayName = "VideoCard";

export const VideoCard = memo(_VideoCard);