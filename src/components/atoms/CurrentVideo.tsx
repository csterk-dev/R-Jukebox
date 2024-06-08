import { Box, Flex, FlexProps, HStack, Icon, Image, Link, SkeletonText, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Tag, Text, Tooltip, useColorModeValue, VStack } from "@chakra-ui/react";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass, HiSignalSlash } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";
import { formatISO8601ToSeconds, formatSecondsToString, formatVideoDuration, formatVideoPublishedDate, replaceHtmlEntities } from "utils/misc";
import { motion, Variants } from "framer-motion";
import { useWebHover, useWindowDimensions } from "@usesoftwareau/react-utils";
import { useAppState } from "state/appContext";
import { FaYoutube } from "react-icons/fa6";


const _CurrentVideo: FC<FlexProps> = ({ ...props }) => {
  const { isMobile } = useAppState();
  const { currentVideo, currentVideoTime, isPlaying, isPlayerLoading, updateCurrentVideoTime, resumeCurrentVideo } = usePlayer();

  const [showProgressTooltip, setShowProgressTooltip] = useState(false);
  const [blockProgressSync, setBlockProgressSync] = useState(false);
  const [localProgressSeconds, setLocalProgressSeconds] = useState(currentVideoTime || 0);
  const [optimisticTimeSeconds, setOptimisticTimeSeconds] = useState(currentVideoTime || 0);

  const localProgressString = useMemo(() => formatVideoDuration(localProgressSeconds), [localProgressSeconds]);
  const videoTimeString = useMemo(() => formatSecondsToString(optimisticTimeSeconds), [optimisticTimeSeconds]);
  const videoDurationSeconds = useMemo(() => formatISO8601ToSeconds(currentVideo?.duration), [currentVideo?.duration]);
  const videoDurationString = useMemo(() => formatVideoDuration(videoDurationSeconds), [videoDurationSeconds]);
  const videoPublishedAt = useMemo(() => formatVideoPublishedDate(currentVideo?.publishedAt), [currentVideo?.publishedAt]);
  const videoTitle = useMemo(() => replaceHtmlEntities(currentVideo?.title), [currentVideo?.title]);

  const foreground = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(13, 15, 24, 0.75)");
  const videoContainer = useColorModeValue("rgba(255, 255, 255, 1)", "rgba(13, 15, 24, 1)");
  const durationBg = useColorModeValue("white", "neutral.500");
  const dimensions = useWindowDimensions();


  /** Change handler for the progress slider to update its value locally (to allow sliding). */
  const onChangeLocalProgressHandler = useCallback((value: number) => {
    setBlockProgressSync(true);
    setLocalProgressSeconds(value - 1);
  }, []);


  /** Optimistically update the time and send the final value to the player. */
  const onChangeEndProgressHandler = useCallback((value: number) => {
    setBlockProgressSync(false);
    updateCurrentVideoTime(value);
    setOptimisticTimeSeconds(value)
    resumeCurrentVideo();
  }, [resumeCurrentVideo, updateCurrentVideoTime]);


  // Optimistically increment the counter if we're playing and havn't reached the end (handle cases where the isPlaying value has yet to be resynced and the optimistic value exceeds the duration)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (currentVideo && isPlaying && videoDurationSeconds && optimisticTimeSeconds < videoDurationSeconds) {
      intervalId = setInterval(() => {
        setOptimisticTimeSeconds(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [currentVideo, isPlaying, optimisticTimeSeconds, videoDurationSeconds]);


  // Sync the optimistic time with the current video time from the server
  useEffect(() => {
    if (currentVideoTime !== undefined) {
      setOptimisticTimeSeconds(currentVideoTime);
    }
  }, [currentVideoTime, localProgressSeconds]);

  const [progressBarHoverRef, progressBarHover] = useWebHover();

  return (
    <Flex as="article" justifyContent="center" {...props}>
      <Flex flexDir="column" gap="10px">

        {/* Video thumbnail preview */}
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
              <Flex
                as="a"
                href={currentVideo ? `https://www.youtube.com/watch?v=${currentVideo.videoId}` : undefined}
                justifyContent="center"
                position="relative"
                target="_blank"
                width="75%"
                zIndex={1}
              >
                <Image
                  aria-label="Video thumbnail"
                  borderRadius={10}
                  pointerEvents="none"
                  src={currentVideo.thumbnails.high.url}
                  userSelect="none"
                  width="100%"
                />
                <Icon
                  aria-label="Open in youtube"
                  as={FaYoutube}
                  bottom={0}
                  boxSize="8%"
                  color="neutral.50"
                  position="absolute"
                  right={0}
                  role="button"
                />
              </Flex> :

              // Placeholder
              <VStack px={isMobile ? "20px" : undefined} zIndex={1}>
                <motion.div animate="animate" initial="initial" variants={TEXT_ANIM_VARIANTS.fadingOpacityAnimation}>
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
              bottom="20px"
              pb="2px"
              position="absolute"
              px="8px"
              right="10px"
              textAlign="center"
            >
              {`${videoTimeString} / ${videoDurationString}`}
            </Text> :
            null
          }
          {currentVideo ?
            <Box
              bottom="2px"
              height="12px"
              position="absolute"
              ref={progressBarHoverRef}
              right={0}
              width="100%"
              zIndex={10}
              onMouseEnter={() => setShowProgressTooltip(true)}
              onMouseLeave={() => setShowProgressTooltip(false)}
            >
              <Slider
                aria-label="Volume control"
                focusThumbOnChange={false}
                isDisabled={!currentVideo}
                max={videoDurationSeconds}
                min={0}
                value={blockProgressSync ? localProgressSeconds : optimisticTimeSeconds}
                variant="videoProgress"
                onChange={val => onChangeLocalProgressHandler(val)}
                onChangeEnd={val => onChangeEndProgressHandler(val)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  isOpen={showProgressTooltip}
                  label={`${blockProgressSync ? localProgressString ?? "0:00" : videoTimeString}`}
                  placement="top"
                  variant="progressBar"
                >
                  <SliderThumb boxSize={progressBarHover ? "18px" : "12px"} />
                </Tooltip>
              </Slider>
            </Box> :
            null
          }
        </Flex>

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
              speed={SKELETON_SPEED}
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
                • Playing
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
              speed={SKELETON_SPEED}
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
            speed={SKELETON_SPEED}
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
 * @extends FlexProps Additional props to configure the parent container.
 * @returns {JSX.Element} The Current video or placeholder.
 */
export const CurrentVideo = memo(_CurrentVideo);


const SKELETON_SPEED = 2;

const TEXT_ANIM_VARIANTS: Record<string, Variants> = {
  fadingOpacityAnimation: {
    initial: { opacity: 1 },
    animate: {
      opacity: 0.5,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  },
  liveTagAnimation: {
    initial: { opacity: 1 },
    animate: {
      opacity: 0.75,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  }
}
