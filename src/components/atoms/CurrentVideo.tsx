import { Box, Flex, FlexProps, HStack, Icon, Image, Tag, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { FC, memo, useMemo } from "react";
import { HiMagnifyingGlass, HiSignalSlash } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";
import { formatVideoDuration, formatVideoPublishedDate, replaceAmps } from "utils/misc";
import { motion, Variants } from "framer-motion";


type CurrentVideoProps = FlexProps;

const _CurrentVideo: FC<CurrentVideoProps> = ({ ...props }) => {
  /*
   * Player State
   */
  const { isPlaying, currentVideo } = usePlayer();


  /*
   * ------------------------------------------------------------------------------------------------------------------ 
   * UI Styling
   */
  const foreground = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(13, 15, 24, 0.75)");
  const videoContainer = useColorModeValue("rgba(255, 255, 255, 1)", "rgba(13, 15, 24, 1)");
  const durationBg = useColorModeValue("white", "neutral.500");
  const dimensions = useWindowDimensions();

  /** A looping opacity animation */
  const fadingOpacityAnimation: Variants = {
    initial: {
      opacity: 1
    },
    animate: {
      opacity: 0.5,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  const liveTagAnimation: Variants = {
    initial: {
      opacity: 1
    },
    animate: {
      opacity: 0.75,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };


  /*
   * ------------------------------------------------------------------------------------------------------------------ 
   * Video Details
   */
  const videoDuration = useMemo(() => formatVideoDuration(currentVideo?.duration), [currentVideo?.duration]);
  const videoPublishedAt = useMemo(() => formatVideoPublishedDate(currentVideo?.publishedAt), [currentVideo?.publishedAt]);
  const videoTitle = useMemo(() => replaceAmps(currentVideo?.title), [currentVideo?.title]);


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
            bg={currentVideo ? `url('${currentVideo.thumbnails.high.url}') center/cover no-repeat` : videoContainer}
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
              src={currentVideo.thumbnails.high.url}
              width="75%"
              zIndex={100}
            /> :
            <VStack zIndex={1}>
              <motion.div
                animate="animate"
                initial="initial"
                variants={fadingOpacityAnimation}
              >
                <VStack zIndex={1}>
                  <Icon
                    as={HiSignalSlash}
                    boxSize="80px"
                  />
                  <Text fontSize="22" mt="10px">Nothing is playing right now...</Text>
                </VStack>
              </motion.div>
              <HStack mt="10px" opacity={0.8}>
                <Icon
                  as={HiMagnifyingGlass}
                  boxSize="20px"
                />
                <Text mb="5px">Use the search bar to find the music you love!</Text>
              </HStack>
            </VStack>
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
                {currentVideo ? videoTitle : undefined}
              </Text>
            </Flex>
            {isPlaying ?
              <Tag
                bg="red.600"
                color="white"
                fontWeight="bold"
                pb="2px"
              >
                <motion.div
                  animate="animate"
                  initial="initial"
                  variants={liveTagAnimation}
                >
                  • Playing
                </motion.div>
              </Tag> :
              currentVideo ?
                <Tag bg="neutral.500" color="white">Paused</Tag> :
                null
            }
          </Flex>
          {currentVideo ?
            <HStack fontSize="18" fontWeight="400">
              <Text>
                {currentVideo.channelTitle}
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

/**
 * Displays the currently active video and its meta data, or a placeholder.
 * 
 * @extends FlexProps Additional props to configure the parent container.
 * @returns {JSX.Element} The Current video or placeholder.
 */
export const CurrentVideo = memo(_CurrentVideo);