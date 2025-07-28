import { Box, Flex, HStack, Icon, Image, Link, SkeletonText, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Stack, StackProps, Tag, Text, Tooltip, VStack } from "@chakra-ui/react";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass, HiSignalSlash } from "react-icons/hi2";
import { usePlayer } from "state/playerContext";
import { ISO8601ToSeconds, replaceHtmlEntities, secondsToString, videoPublishedDateToString } from "utils/misc";
import { motion, Variants } from "framer-motion";
import { useAppState } from "state/appContext";
import { FaYoutube } from "react-icons/fa6";
import dayjs from "dayjs";
import { GiWinterHat } from "react-icons/gi";

type CurrentVideoProps = StackProps & {};


const _CurrentVideo: FC<CurrentVideoProps> = ({ ...props }) => {
  const { isMobile, themeSeason } = useAppState();
  const { currentVideo, currentVideoTime, isPlaying, isPlayerLoading, pauseResumeCurrentVideo, updatePlayerTimestamp } = usePlayer();
  const showingCurrentVideo = currentVideo && !isPlayerLoading;

  const [showPublishedAtAsDate, setShowPublishedAtAsDate] = useState(false);
  const [isSlidingLocal, setIsSlidingLocal] = useState(false);
  const [localProgressSeconds, setLocalProgressSeconds] = useState(currentVideoTime || 0);
  const [optimisticTimeSeconds, setOptimisticTimeSeconds] = useState(currentVideoTime || 0);

  const localProgressString = useMemo(() => secondsToString(localProgressSeconds), [localProgressSeconds]);
  const videoTimeString = useMemo(() => secondsToString(optimisticTimeSeconds), [optimisticTimeSeconds]);
  const videoDurationSeconds = useMemo(() => ISO8601ToSeconds(currentVideo?.duration), [currentVideo?.duration]);
  const videoDurationString = useMemo(() => secondsToString(videoDurationSeconds), [videoDurationSeconds]);
  const videoPublishedAt = useMemo(() => videoPublishedDateToString(currentVideo?.publishedAt), [currentVideo?.publishedAt]);
  const videoTitle = useMemo(() => replaceHtmlEntities(currentVideo?.title), [currentVideo?.title]);

  const togglePublishedAtDate = useCallback(() => setShowPublishedAtAsDate(prev => !prev), []);

  /** Change handler for the progress slider to update its value locally (to allow sliding). */
  const onChangeLocalProgressHandler = useCallback((value: number) => {
    setIsSlidingLocal(true);
    setLocalProgressSeconds(value - 1);
  }, []);


  /** Optimistically update the time and send the final value to the player. */
  const onChangeEndProgressHandler = useCallback((value: number) => {
    setIsSlidingLocal(false);
    updatePlayerTimestamp(value);
    setOptimisticTimeSeconds(value)
    pauseResumeCurrentVideo("resume");
  }, [updatePlayerTimestamp, pauseResumeCurrentVideo]);


  // Optimistically increment the counter if we're playing and havn't reached the end (handle cases where the isPlaying value has yet to be resynced and the optimistic value exceeds the duration)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (!isSlidingLocal && showingCurrentVideo && isPlaying && videoDurationSeconds && optimisticTimeSeconds < videoDurationSeconds) {
      intervalId = setInterval(() => {
        setOptimisticTimeSeconds(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isSlidingLocal, showingCurrentVideo, isPlaying, optimisticTimeSeconds, videoDurationSeconds]);


  // Sync the optimistic time with the current video time from the server
  useEffect(() => {
    if (currentVideoTime !== undefined) {
      setOptimisticTimeSeconds(currentVideoTime);
    }
  }, [currentVideoTime, localProgressSeconds]);


  return (
    <Stack as="article" {...props}>

      {/* Video thumbnail preview */}
      <Flex
        alignItems="center"
        bg={showingCurrentVideo ? "neutral.900" : "surface.solid"}
        borderBottomRadius="base"
        borderTopRadius="lg"
        height="calc(100vw / 3)"
        justifyContent="center"
        minHeight={isMobile ? "300px" : "400px"}
        minWidth={isMobile ? "300px" : "400px"}
        position="relative"
        width="calc(100vw / 3)"
      >
        <Box
          alignItems="center"
          borderRadius="lg"
          display="flex"
          h="100%"
          justifyContent="center"
          overflow="hidden"
          position="relative"
          w="100%"
        >
          <Box
            bg={showingCurrentVideo ? `url('${currentVideo.thumbnails.high.url}') center/cover no-repeat` : "surface.solid"}
            borderRadius="lg"
            filter={`blur(${currentVideo ? "10px" : "0px"})`}
            height="100%"
            position="absolute"
            width="100%"
          />

          {isPlayerLoading ?
            <Spinner /> :

            currentVideo ?
              <Flex
                as="a"
                href={currentVideo ? `https://www.youtube.com/watch?v=${currentVideo.videoId}&t=${optimisticTimeSeconds}` : undefined}
                justifyContent="center"
                position="relative"
                target="_blank"
                width="75%"
                zIndex={1}
              >
                <Image
                  aria-label="Video thumbnail"
                  borderRadius="lg"
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
              <VStack gap={5} px={isMobile ? 5 : undefined} zIndex={1}>
                <motion.div animate="animate" initial="initial" variants={TEXT_ANIM_VARIANTS.fadingOpacityAnimation}>
                  <VStack gap={4} zIndex={1}>
                    <Icon as={HiSignalSlash} boxSize="80px" />
                    <Text fontSize="2xl" textAlign="center">{`Nothing is playing${!isMobile ? " right now" : ""}...`}</Text>
                  </VStack>
                </motion.div>
                <HStack
                  alignItems="flex-start"
                  ml={isMobile ? "12px" : undefined}
                  opacity={0.8}
                  px={isMobile ? "20px" : undefined}
                >
                  <Icon as={HiMagnifyingGlass} boxSize="20px" mt="4px" />
                  <Text>Use the search bar to find the music you love!</Text>
                </HStack>
              </VStack>
          }

          {showingCurrentVideo ?
            <Text
              _dark={{ bg: "neutral.500" }}
              bg="neutral.50"
              borderRadius="sm"
              bottom={5}
              pb="2px"
              position="absolute"
              px={2}
              right={2.5}
              textAlign="center"
            >
              {`${videoTimeString} / ${videoDurationString}`}
            </Text> :
            null
          }

        </Box>
        {showingCurrentVideo ?
          <Box
            bottom="5.5px"
            height="5px"
            left={0}
            position="absolute"
            width="100%"
            zIndex="docked"
          >
            <Slider
              aria-label="Volume control"
              focusThumbOnChange={false}
              isDisabled={!currentVideo}
              max={videoDurationSeconds}
              min={0}
              role="group"
              value={isSlidingLocal ? localProgressSeconds : optimisticTimeSeconds}
              variant="videoProgress"
              onChange={val => onChangeLocalProgressHandler(val)}
              onChangeEnd={val => onChangeEndProgressHandler(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip isOpen={isSlidingLocal} label={`${isSlidingLocal ? localProgressString ?? "0:00" : videoTimeString}`} placement="top">
                <SliderThumb />
              </Tooltip>
            </Slider>
          </Box> :
          null
        }
      </Flex>

      {/* Current song info */}
      <Flex
        as="section"
        bgColor="surface.foreground-transparent"
        borderRadius="lg"
        boxShadow="lg"
        flexDir="column"
        gap="10px"
        minWidth={isMobile ? "300px" : "400px"}
        p="10px"
        position="relative"
        width="calc(100vw / 3)"
      >
        {themeSeason === "christmas" ?
          <Icon
            _dark={{ color: "red.100" }}
            as={GiWinterHat}
            color="red.700"
            fontSize={35}
            position="absolute"
            right={-3}
            top={-5}
            transform="rotate(20deg)"
          /> :
          null
        }
        <Flex alignItems="center" justifyContent="space-between">
          <SkeletonText
            isLoaded={!isPlayerLoading}
            noOfLines={1}
            skeletonHeight="14px"
            speed={SKELETON_SPEED}
          >
            <Text fontSize="sm" textTransform="uppercase">
              {currentVideo ? "Current Song" : "No song selected"}
            </Text>
          </SkeletonText>

          {showingCurrentVideo && isPlaying ?
            <Tag
              bg="red.600"
              color="white"
              fontWeight="bold"
              pb="2px"
              userSelect="none"
            >
              • Playing
            </Tag> :
            showingCurrentVideo ?
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
              as="h1"
              fontSize="xl"
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
          <Flex
            alignItems="flex-start"
            color="text.subtle"
            flexDir={isMobile ? "column" : "row"}
            fontSize="lg"
            gap={2}
            width="100%"
          >
            <Link href={showingCurrentVideo ? `https://www.youtube.com/channel/${currentVideo.channelId}` : undefined} isExternal>
              {showingCurrentVideo ? currentVideo.channelTitle : null}
            </Link>
            {showingCurrentVideo && !isMobile ? <Text>•</Text> : null}
            <Text role="button" onClick={togglePublishedAtDate}>
              {showPublishedAtAsDate ? dayjs(currentVideo?.publishedAt).format("DD/MM/YYYY") : videoPublishedAt}
            </Text>
          </Flex>
        </SkeletonText>
      </Flex>
    </Stack>
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
