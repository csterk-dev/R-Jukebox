import { Box, Flex, FlexProps, HStack, Icon, Image, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { FC, memo } from "react";
import { HiMusicalNote } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";
import { formatVideoDuration, formatVideoPublishedDate, replaceAmps } from "utils/misc";


type CurrentVideoProps = FlexProps;

const _CurrentVideo: FC<CurrentVideoProps> = ({ ...props }) => {
  const foreground = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(13, 15, 24, 0.75)");
  const videoContainer = useColorModeValue("rgba(255, 255, 255, 1)", "rgba(13, 15, 24, 1)");
  const durationBg = useColorModeValue("white", "neutral.500");
  const dimensions = useWindowDimensions();

  const { isPlaying, currentVideo } = usePlayer();

  const videoDuration = formatVideoDuration(currentVideo?.contentDetails.duration);
  const videoPublishedAt = formatVideoPublishedDate(currentVideo?.video.snippet.publishedAt);
  const videoTitle = replaceAmps(currentVideo?.video.snippet.title);

  return (
    <Flex
      flex={{
        base: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 2
      }}
      justifyContent="center"
      {...props}
    >
      <Flex flexDir={dimensions.height < 600 ? "row" : "column"} gap="10px">
        <Flex
          alignItems="center"
          bg={currentVideo ? "rgba(13, 15, 24, 0.75)" : videoContainer}
          borderRadius={10}
          height={dimensions.height < 600 ? "100%" : dimensions.width / 3}
          justifyContent="center"
          minHeight="400px"
          minWidth="400px"
          position="relative"
          width={dimensions.width / 3}
        >
          <Box
            bg={currentVideo ? `url('${currentVideo.video.snippet.thumbnails.high.url}') center/cover no-repeat` : videoContainer}
            borderRadius={10}
            filter={`blur(${currentVideo ? "10px" : "0px"})`}
            height="95%"
            position="absolute"
            width="95%"
          />
          {currentVideo ?
            <Image
              aria-label="Video thumbnail"
              borderRadius={10}
              src={currentVideo.video.snippet.thumbnails.high.url}
              width="75%"
              zIndex={100}
            /> :
            <Icon
              as={HiMusicalNote}
              boxSize={20}
              zIndex={1}
            />
          }

          {currentVideo ?
            <Text
              bgColor={durationBg}
              borderRadius={4}
              bottom="10px"
              pb="2px"
              position="absolute"
              px="8px"
              right="10px"
              textAlign="center"
            >
              {videoDuration}
            </Text> :
            null
          }
        </Flex>

        {/* Current song info */}
        <Flex
          bgColor={foreground}
          borderRadius={10}
          boxShadow="lg"
          flexDir="column"
          gap="10px"
          minWidth="400px"
          p="10px"
          width={dimensions.width / 3}
          zIndex={100}
        >
          <Flex alignItems="flex-start">
            <Flex flex={1} flexDirection="column">
              <Text
                fontSize="14"
                fontWeight="500"
                textTransform="uppercase"
              >
                {currentVideo ? "Current Song" : "No song selected"}
              </Text>
              <Text
                as="h2"
                fontSize="20"
                fontWeight="600"
                mt="10px"
                noOfLines={2}
                textOverflow="ellipsis"
              >
                {currentVideo ? videoTitle : "Use the search bar to find a song!"}
              </Text>
            </Flex>
            {isPlaying ? <Tag bg="red.500" color="white">• Playing</Tag> : currentVideo ? <Tag bg="neutral.500" color="white">Paused</Tag> : null}
          </Flex>
          {currentVideo ?
            <HStack fontSize="18" fontWeight="400">
              <Text>
                {currentVideo.video.snippet.channelTitle}
              </Text>
              {/* <Text>
              •
            </Text>
            <Text>
              236k views
            </Text> */}
              <Text>
                •
              </Text>
              <Text>
                {videoPublishedAt}
              </Text>
            </HStack> :
            null
          }
        </Flex>
      </Flex>
    </Flex>
  )
}
_CurrentVideo.displayName = "CurrentVideo";

export const CurrentVideo = memo(_CurrentVideo);