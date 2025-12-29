import { Box, Flex, HStack, Icon, Image, Link, LinkBox, LinkOverlay, Skeleton, SkeletonText, Slider, Spinner, Stack, StackProps, Tag, Text, VisuallyHidden, VStack } from "@chakra-ui/react";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass, HiSignalSlash } from "react-icons/hi2";
import { useAppState, usePlayer } from "@state";
import { ISO8601ToSeconds, replaceHtmlEntities, secondsToString, videoPublishedDateToString } from "@utils";
import { FaYoutube } from "react-icons/fa6";
import { GiWinterHat } from "react-icons/gi";
import dayjs from "dayjs";
import { Tooltip } from "@ui";

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
        bg={showingCurrentVideo ? "neutral.900" : "surface.background"}
        borderBottomRadius="lg"
        borderTopRadius="lg"
        height="calc(100vw / 3)"
        justifyContent="center"
        minHeight={{
          base: "300px",
          sm: "400px"
        }}
        minWidth={{
          base: "300px",
          sm: "400px"
        }}
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
            bg={showingCurrentVideo ? `url('${currentVideo.thumbnails.high.url}') center/cover no-repeat` : "surface.background"}
            filter={`blur(${currentVideo ? "10px" : "0px"})`}
            height="100%"
            position="absolute"
            width="100%"
          />

          {isPlayerLoading ?
            <Spinner /> :

            currentVideo ?
              <LinkBox
                justifyContent="center"
                position="relative"
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
                <LinkOverlay href={`https://www.youtube.com/watch?v=${currentVideo.videoId}&t=${optimisticTimeSeconds}`} target="_blank">
                  <Icon
                    as={FaYoutube}
                    bottom={0}
                    boxSize="8%"
                    color="neutral.50"
                    position="absolute"
                    right={0}
                    role="button"
                  />
                  <VisuallyHidden>Open in youtube</VisuallyHidden>
                </LinkOverlay>
              </LinkBox> :

              // Placeholder
              <VStack gap={5} px={{ sm: 5 }} zIndex={1}>
                <VStack animation="fadingOpacity" gap={4} zIndex={1}>
                  <Icon as={HiSignalSlash} boxSize="80px" />
                  <Text fontSize="2xl" textAlign="center">{`Nothing is playing${!isMobile ? " right now" : ""}...`}</Text>
                </VStack>
                <HStack
                  alignItems="flex-start"
                  ml={{
                    base: "12px",
                    sm: "unset"
                  }}
                  px={{
                    base: "20px",
                    sm: "unset"
                  }}
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
              {`${`${isSlidingLocal ? localProgressString ?? "0:00" : videoTimeString}`} / ${videoDurationString}`}
            </Text> :
            null
          }

        </Box>
        {showingCurrentVideo ?
          <Box
            bottom="5px"
            height="5px"
            left={0}
            position="absolute"
            width="100%"
            zIndex="docked"
          >
            <Slider.Root
              disabled={!currentVideo}
              max={videoDurationSeconds}
              min={0}
              size="sm"
              value={[isSlidingLocal ? localProgressSeconds : optimisticTimeSeconds]}
              variant="videoProgress"
              onValueChange={(e) => onChangeLocalProgressHandler(e.value[0])}
              onValueChangeEnd={(e) => onChangeEndProgressHandler(e.value[0])}
            >
              <Slider.Control className="group">
                <Slider.Track _groupHover={{ h: "6px" }} h="4px">
                  <Slider.Range _groupHover={{ h: "6px" }} />
                </Slider.Track>

                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
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
        minWidth={{
          base: "300px",
          sm: "400px"
        }}
        p={2}
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
        <Flex alignItems="center">
          <SkeletonText loading={isPlayerLoading} noOfLines={1} w="120px">
            <Text fontSize="sm" textTransform="uppercase">
              {currentVideo ? "Current Song" : "No song selected"}
            </Text>
          </SkeletonText>

          {showingCurrentVideo && isPlaying ?
            <Tag.Root bg="red.600" ml="auto" pb="2px">
              <Tag.Label color="white" fontWeight="bold">
                Playing
              </Tag.Label>
            </Tag.Root> :
            showingCurrentVideo ?
              <Tag.Root bg="neutral.500" ml="auto">
                <Tag.Label color="white">
                  Paused
                </Tag.Label>
              </Tag.Root> :
              null
          }
        </Flex>


        <Stack gap={4}>
          <SkeletonText loading={isPlayerLoading} noOfLines={1}>
            <Text
              as="h1"
              fontSize="xl"
              fontWeight="semibold"
              lineClamp={3}
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {videoTitle}
            </Text>
          </SkeletonText>


          <Skeleton loading={isPlayerLoading} width={isPlayerLoading ? "65%" : "100%"}>
            <Flex
              alignItems="flex-start"
              flexDir={{
                md: "column",
                lg: "row"
              }}
              fontSize="lg"
              gap={2}
              width="100%"
            >
              <Link href={showingCurrentVideo ? `https://www.youtube.com/channel/${currentVideo.channelId}` : undefined} target="_blank">
                {showingCurrentVideo ? currentVideo.channelTitle : null}
              </Link>
              {showingCurrentVideo ? <Text hideBelow="md">•</Text> : null}
              <Tooltip content="Toggle date" contentProps={{ bg: "surface.foreground" }} positioning={{ placement: "top" }}>
                <Text _hover={{ cursor: "pointer" }} role="button" onClick={togglePublishedAtDate}>
                  {showPublishedAtAsDate ? dayjs(currentVideo?.publishedAt).format("DD/MM/YYYY") : videoPublishedAt}
                </Text>
              </Tooltip>
            </Flex>
          </Skeleton>
        </Stack>
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