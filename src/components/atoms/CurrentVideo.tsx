import { Box, Flex, FlexProps, HStack, Icon, Image, Link, LinkBox, LinkOverlay, SkeletonText, Spinner, Tag, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { FC, memo, useMemo } from "react";
import { HiMagnifyingGlass, HiSignalSlash } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";
import { formatVideoDuration, formatVideoPublishedDate, replaceAmps } from "utils/misc";
import { motion, Variants } from "framer-motion";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { useAppState } from "state/appContext";

const skeletonSpeed = 2

type CurrentVideoProps = FlexProps;

const _CurrentVideo: FC<CurrentVideoProps> = ({ ...props }) => {
  /*
   * Player State
   */
  const { isPlaying, currentVideo, isPlayerLoading } = usePlayer();

  /*
   * ------------------------------------------------------------------------------------------------------------------ 
   * UI Styling
   */
  const foreground = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(13, 15, 24, 0.75)");
  const videoContainer = useColorModeValue("rgba(255, 255, 255, 1)", "rgba(13, 15, 24, 1)");
  const durationBg = useColorModeValue("white", "neutral.500");
  const dimensions = useWindowDimensions();
  const { isMobile } = useAppState();



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
      as="article"
      justifyContent="center"
      {...props}
    >
      <Flex flexDir="column" gap="10px">

        {/* Video thumbnail preview */}
        <LinkBox as="section">
          <LinkOverlay href={currentVideo ? `https://www.youtube.com/watch?v=${currentVideo.videoId}` : undefined} isExternal>
            <Flex
              alignItems="center"
              bg={currentVideo ? "rgba(13, 15, 24, 0.75)" : videoContainer}
              borderRadius={10}
              height={dimensions.height < 600 ? "100%" : dimensions.width / 3}
              justifyContent="center"
              minHeight={isMobile ? "300px" : "400px"}
              minWidth={isMobile ? "300px" : "400px"}
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

              {isPlayerLoading ?
                <Spinner /> :

                currentVideo ?
                  <Image
                    aria-label="Video thumbnail"
                    borderRadius={10}
                    pointerEvents="none"
                    src={currentVideo.thumbnails.high.url}
                    userSelect="none"
                    width="75%"
                    zIndex={1}
                  /> :

                  // Placeholder
                  <VStack px={isMobile ? "20px" : undefined} zIndex={1}>
                    <motion.div
                      animate="animate"
                      initial="initial"
                      variants={fadingOpacityAnimation}
                    >
                      <VStack zIndex={1}>
                        <Icon as={HiSignalSlash} boxSize="80px" />
                        <Text fontSize="22" mt="10px" textAlign="center">{`Nothing is playing${!isMobile ? " right now" : ""}...`}</Text>
                      </VStack>
                    </motion.div>
                    <HStack
                      alignItems="flex-start"
                      ml={isMobile ? "12px" : undefined}
                      mt="10px"
                      opacity={0.8}
                      px={isMobile ? "20px" : undefined}
                    >
                      <Icon as={HiMagnifyingGlass} boxSize="20px" mt="4px" />
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
          </LinkOverlay>
        </LinkBox>

        {/* Current song info */}

        <Flex
          as="section"
          bgColor={foreground}
          borderRadius={10}
          boxShadow="lg"
          flexDir="column"
          gap="10px"
          minWidth={isMobile ? "300px" : "400px"}
          p="10px"
          width={dimensions.width / 3}
          zIndex={10}
        >
          <Flex alignItems="center" justifyContent="space-between">
            <SkeletonText
              isLoaded={!isPlayerLoading}
              noOfLines={1}
              skeletonHeight="14px"
              speed={skeletonSpeed}
            >
              <Text fontSize="14" fontWeight="500" textTransform="uppercase">
                {currentVideo ? "Current Song" : "No song selected"}
              </Text>
            </SkeletonText>

            {currentVideo && isPlaying && !isPlayerLoading ?
              <Tag
                bg="red.600"
                color="white"
                fontWeight="bold"
                pb="2px"
                userSelect="none"
              >
                <motion.div
                  animate="animate"
                  initial="initial"
                  variants={liveTagAnimation}
                >
                  • Playing
                </motion.div>
              </Tag> :
              currentVideo && !isPlayerLoading ?
                <Tag bg="neutral.500" color="white" userSelect="none">Paused</Tag> :
                null
            }
          </Flex>


          <Flex flex={1} flexDirection="column">
            <SkeletonText
              isLoaded={!isPlayerLoading}
              noOfLines={2}
              skeletonHeight="20px"
              speed={skeletonSpeed}
            >
              <Text
                as="h2"
                fontSize="20"
                fontWeight="600"
                noOfLines={3}
                textOverflow="ellipsis"
              >
                {videoTitle}
              </Text>
            </SkeletonText>
          </Flex>

          <SkeletonText
            isLoaded={!isPlayerLoading}
            noOfLines={1}
            skeletonHeight="18px"
            speed={skeletonSpeed}
            width={isPlayerLoading ? "65%" : "100%"}
          >
            {isMobile ?
              <VStack 
                alignItems="flex-start"
                fontSize="18" 
                fontWeight="400" 
                width="100%"
              >
                <Link href={currentVideo ? `https://www.youtube.com/channel/${currentVideo.channelId}` : undefined} isExternal>
                  {currentVideo ? currentVideo.channelTitle : null}
                </Link>
                <Text>
                  {videoPublishedAt}
                </Text>
              </VStack> :
              <HStack fontSize="18" fontWeight="400" width="100%">
                <Link href={currentVideo ? `https://www.youtube.com/channel/${currentVideo.channelId}` : undefined} isExternal>
                  {currentVideo ? currentVideo.channelTitle : null}
                </Link>
                {currentVideo ? <Text>•</Text> : null}
                <Text>
                  {videoPublishedAt}
                </Text>
              </HStack>
            }
          </SkeletonText>
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