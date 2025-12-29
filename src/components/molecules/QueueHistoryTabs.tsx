import { Box, Button, Circle, Dialog, Field, Flex, FlexProps, IconButton, Input, InputGroup, NativeSelect, Portal, Spinner, Stack, Tabs, Text, useDisclosure, usePrevious } from "@chakra-ui/react";
import { Placeholder, VideoCard } from "@atoms";
import { Tooltip } from "@ui";
import { ChangeEvent, Dispatch, FC, FormEvent, memo, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiClock, HiFaceFrown, HiRectangleStack, HiXMark } from "react-icons/hi2";
import { useAppState, usePaginatedHistory, usePlayer } from "@state";
import { HistorySortTypes, ISO8601ToSeconds, secondsToString, videoPlayedAtToString } from "@utils";


const HISTORY_SORT_OPTIONS: SelectOption<HistorySortTypes>[] = [
  {
    label: "Latest",
    value: "PLAYED_AT_DATE_DESCENDING"
  },
  {
    label: "Oldest",
    value: "PLAYED_AT_DATE_ASCENDING"
  }
]


type QueueHistoryProps = FlexProps & {
  /** Callback used to scroll back to the top of the screen. */
  handleScrollToTop(): void;
  /** Indicates when at bottom of the page. */
  isAtBottomOfPage: boolean;
  /** Callback for the global bottom state. */
  setIsAtBottomOfPage: Dispatch<SetStateAction<boolean>>;
  /** Value determined by viewport media query. */
  isLandscape: boolean;
};

const _QueueHistoryTabs: FC<QueueHistoryProps> = ({ setIsAtBottomOfPage: setIsNearBottomOfPage, handleScrollToTop, isAtBottomOfPage, isLandscape, ...props }) => {
  const { queue, playVideo, addToBottomOfQueue, addToTopOfQueue, clearQueue, deleteQueueItem } = usePlayer();
  const { showDevDebugging, isMobile } = useAppState();
  const [tabValue, setTabValue] = useState<string>("queue");
  const { open: isClearConfOpen, onOpen: onOpenClearConf, onClose: onCloseClearConf } = useDisclosure();
  const { open: isHistoryOptionsOpen, onOpen: onOpenHistoryOptions, onClose: onCloseHistoryOptions } = useDisclosure();
  const panelsRef = useRef<HTMLDivElement>(null);
  const historyPanelRef = useRef<HTMLDivElement>(null);
  const hasHistoryTabFocused = tabValue === "history";
  const previouslyFocusedQueue = usePrevious(!hasHistoryTabFocused);

  const {
    data: historyPages,
    isLoading,
    isValidating,
    error,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
    loadMore,
    hasMore
  } = usePaginatedHistory();

  /** Returns a single array of all history items for rendering. */
  const allHistoryVideos: HistoryVideo[] = useMemo(() => !historyPages ? [] : historyPages.flat(), [historyPages]);


  /** 
   * Handle history infinite pagination when in landscape mode (scrolling is within the history panel)
   */
  useEffect(() => {
    if (isLandscape) {
      const handleScroll = () => {
        const container = panelsRef.current;

        if (container) {
          const { scrollTop, scrollHeight, clientHeight } = container;
          const threshold = 5;

          const isNearBottomOfHistoryPanel = Math.abs(scrollHeight - clientHeight - scrollTop) <= threshold

          // If near bottom, not currently loading/validating, and there might be more data
          if (hasHistoryTabFocused && isNearBottomOfHistoryPanel && !isValidating && !error && hasMore) {
            showDevDebugging && console.info("QueueHistoryTabs: loading more items triggered from local scroll.");
            loadMore();
          }
        }
      };

      const container = panelsRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (container) {
          container.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [isValidating, hasMore, hasHistoryTabFocused, isLandscape, loadMore, error, showDevDebugging]);


  /**
   * Handle history infinite pagination when in portrait mode (scrolling is done by the page root page container), 
   */
  useEffect(() => {
    // Timeout is required here to prevent the loadMore triggering a re-render before the boolean states can update to stop additional loadMore calls.
    setTimeout(() => {
      if (!isLandscape && isAtBottomOfPage && !isValidating && !error && hasMore && hasHistoryTabFocused && !previouslyFocusedQueue) {
        showDevDebugging && console.info("QueueHistoryTabs: loading more items triggered from root scroll.");

        setIsNearBottomOfPage(false);
        loadMore();
      }
    }, 200);
  }, [error, hasHistoryTabFocused, hasMore, isAtBottomOfPage, isLandscape, isValidating, loadMore, previouslyFocusedQueue, setIsNearBottomOfPage, showDevDebugging]);


  /** When focused, scrolls to the top of the history panel. */
  const onClickScrollToTop = useCallback(() => {
    if ((historyPanelRef.current && historyPanelRef.current.offsetTop > 10) && isLandscape) {
      historyPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  }, [isLandscape]);


  /** Plays the video and scrolls to the top of the screen when in portrait mode. */
  const onClickPlayVideo = useCallback((video: Video) => {
    if (!isLandscape) handleScrollToTop();
    playVideo(video)
  }, [handleScrollToTop, isLandscape, playVideo]);


  /** Returns an array of grouped history videos by date. */
  const historyCards: JSX.Element[] = useMemo(() => {
    if (!allHistoryVideos.length) return [];

    type SortedHistory = { [key: string]: HistoryVideo[] }

    const sortedHistory = allHistoryVideos.reduce((grouped: SortedHistory, video: HistoryVideo) => {
      const vidDate = video.playedDate;
      if (!grouped[vidDate]) grouped[vidDate] = [];

      grouped[vidDate].push(video);
      return grouped;
    }, {} as SortedHistory);

    const jsx: JSX.Element[] = [];

    // Sort the dates in descending order for display
    const sortedDates = Object.keys(sortedHistory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());


    sortedDates.forEach(date => {
      const videos = sortedHistory[date];
      const dateText = videoPlayedAtToString(date);
      jsx.push(
        <Stack key={dateText} width="100%">
          <Text textStyle="body/label">{dateText}</Text>
          {videos.map(vid => (
            <VideoCard
              key={`${vid.videoId}${vid.playedAt}`}
              addToBottomOfQueue={() => addToBottomOfQueue(vid, "add")}
              addToTopOfQueue={() => addToTopOfQueue(vid, "add")}
              as="li"
              isMobile={isMobile}
              playVideo={onClickPlayVideo}
              video={vid}
            />
          ))}
        </Stack>
      )
    });

    return jsx;
  }, [allHistoryVideos, isMobile, onClickPlayVideo, addToBottomOfQueue, addToTopOfQueue]);


  /** The total lenth of all queue videos, as text. */
  const queueDurationSum = useMemo(() => {
    const seconds = queue.reduce((sum, curr) => {
      const durationSeconds = ISO8601ToSeconds(curr.duration);
      if (!durationSeconds) return sum + 0;
      return sum + durationSeconds;
    }, 0)

    return secondsToString(seconds, "text");
  }, [queue]);


  /** Clears the queue and closes the confirmation modal. */
  const onClickConfirmClear = useCallback(() => {
    clearQueue();
    onCloseClearConf();
  }, [clearQueue, onCloseClearConf]);


  const [historySearchInputVal, setHistorySearchInputVal] = useState<string>("");
  const [historySortInputVal, setHistorySortInputVal] = useState<HistorySortTypes>(sort);
  const hasHistoryOptionsEnabled = useMemo(() => {
    return !!searchTerm || sort !== "PLAYED_AT_DATE_DESCENDING";
  }, [searchTerm, sort]);


  /** Updates the relevant SWR states requerying the history. */
  const handleSubmitHistoryOptions = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (historySearchInputVal) setSearchTerm(historySearchInputVal);
    else setSearchTerm(undefined);

    setSort(historySortInputVal);

    onCloseHistoryOptions();
  }, [historySearchInputVal, historySortInputVal, onCloseHistoryOptions, setSearchTerm, setSort])



  return (
    <>
      <Flex
        bgColor="surface.foreground-transparent"
        borderRadius="lg"
        boxShadow="lg"
        h={{
          base: "100%",
          lg: "calc(100dvh - 80px)"
        }}
        maxW={{
          base: "300px",
          sm: "400px"
        }}
        overflow="clip"
        width="100%"
        {...props}
      >
        <Tabs.Root
          colorPalette="brand"
          defaultValue="queue"
          display="flex"
          flexDirection="column"
          value={tabValue}
          variant="subtle"
          width="100%"
          onValueChange={useCallback((e: { value: string }) => {
            setTabValue(e.value);
            if (e.value === "history") {
              setIsNearBottomOfPage(false);
              onClickScrollToTop();
            }
          }, [onClickScrollToTop, setIsNearBottomOfPage])}
        >
          <Tabs.List
            alignItems="center"
            bg="surface.background"
            boxShadow="base"
            justifyContent="space-between"
            p={2}
          >
            <Flex>
              <Tabs.Trigger color="fg.body" value="queue">Queue</Tabs.Trigger>
              <Tabs.Trigger color="fg.body" value="history">History</Tabs.Trigger>
            </Flex>
            {tabValue === "queue" ?
              <Button disabled={queue.length === 0} variant="tertiary" onClick={onOpenClearConf}>
                Clear
              </Button> :
              <Box position="relative">
                <Circle
                  bg="blue.500"
                  display={hasHistoryOptionsEnabled ? "block" : "none"}
                  position="absolute"
                  right={1}
                  size="8px"
                  top={1}
                />
                <Button onClick={onOpenHistoryOptions}>
                  Options
                </Button>
              </Box>
            }
          </Tabs.List>
          <Box
            height="100%"
            layerStyle="themed-scroll"
            overflowY="auto"
            ref={panelsRef}
          >
            <Tabs.Content height="100%" p="8px 8px 8px 0px" value="queue">
              {queue.length === 0 ?
                <Placeholder
                  icon={HiRectangleStack}
                  mb={5}
                  pl={2}
                  title="Queued videos will appear here"
                /> :
                <Stack as="ol" flex={1}>
                  <Text px="10px" textStyle="body/label">{queueDurationSum}</Text>
                  {queue.map(vid => (
                    <Flex
                      key={vid.videoId}
                      _last={{ mb: 2 }}
                      alignItems="center"
                      as="li"
                    >
                      <Tooltip content="Remove item" positioning={{ placement: "left" }}>
                        <IconButton aria-label="Remove video from queue" variant="tertiary" onClick={() => deleteQueueItem(vid.videoId)}>
                          <HiXMark />
                        </IconButton>
                      </Tooltip>
                      <VideoCard
                        addToBottomOfQueue={() => addToBottomOfQueue(vid, "move")}
                        addToTopOfQueue={() => addToTopOfQueue(vid, "move")}
                        isMobile={isMobile}
                        playVideo={playVideo}
                        video={vid}
                      />
                    </Flex>
                  ))}
                </Stack>
              }
            </Tabs.Content>

            <Tabs.Content
              height="100%"
              pl={2}
              pr={1}
              py={2}
              ref={historyPanelRef}
              value="history"
            >
              {!allHistoryVideos.length && !isLoading && !isValidating ? (
                <Placeholder icon={hasHistoryOptionsEnabled ? HiFaceFrown : HiClock} mb={5} title={hasHistoryOptionsEnabled ? "No history videos match those options" : "History will appear here"} />
              ) : (
                <Stack as="ol" flex={1} pb={1}>
                  {historyCards}

                  {error ?
                    <Text color="fg.error" textAlign="center">
                      Error loading history.
                    </Text> :

                    isValidating ?
                      <Box mx="auto" pt={1}>
                        <Spinner size="sm" />
                      </Box> :

                      !hasMore ?
                        <Text color="fg.muted" textAlign="center">
                          {searchTerm ? "No more videos to display" : "You've reached the end of the history"}
                        </Text> :
                        null
                  }
                </Stack>
              )}
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>

      <Dialog.Root
        open={isClearConfOpen}
        role="alertdialog"
        size="xs"
        onOpenChange={(e) => !e.open && onCloseClearConf()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Clear queue?</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body gap={4}>
                Are you sure that you want to clear all videos in the queue?
              </Dialog.Body>

              <Dialog.Footer>
                <Button
                  size="sm"
                  variant="destructive"
                  width="100%"
                  onClick={onClickConfirmClear}
                >
                  Clear
                </Button>
                <Dialog.ActionTrigger asChild>
                  <Button variant="secondary" width="100%">
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>


      <Dialog.Root
        open={isHistoryOptionsOpen}
        role="alertdialog"
        size="xs"
        onOpenChange={(e) => !e.open && onCloseHistoryOptions()}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <form onSubmit={handleSubmitHistoryOptions}>
                <Dialog.Header>
                  <Dialog.Title>History View Options</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                  <Field.Root as="search">
                    <Field.Label color="fg.muted">Sort by</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        css={{
                          "--focus-color": "colors.primary.500"
                        }}
                        value={historySortInputVal}
                        onChange={useCallback((e: ChangeEvent<HTMLSelectElement>) => setHistorySortInputVal(e.target.value as HistorySortTypes), [])}
                      >
                        {HISTORY_SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label color="fg.muted">Search term</Field.Label>
                    <InputGroup
                      endElement={
                        <Button
                          _hover={{
                            color: "fg.accent",
                            textDecoration: "underline"
                          }}
                          colorPalette="brand"
                          display={historySearchInputVal ? "inline-block" : "none"}
                          mr="-10px"
                          size="sm"
                          variant="plain"
                          onClick={useCallback(() => setHistorySearchInputVal(""), [])}
                        >
                          Clear
                        </Button>
                      }
                    >
                      <Input
                        css={{
                          "--focus-color": "colors.primary.500"
                        }}
                        enterKeyHint="search"
                        placeholder="Search by video title or channel"
                        type="text"
                        value={historySearchInputVal}
                        variant="outline"
                        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setHistorySearchInputVal(e.target.value), [setHistorySearchInputVal])}
                      />
                    </InputGroup>
                  </Field.Root>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button
                    disabled={isValidating || isLoading}
                    loading={isValidating || isLoading}
                    type="submit"
                    variant="primary"
                    width="100%"
                  >
                    Apply
                  </Button>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="secondary" width="100%">
                      Close
                    </Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
_QueueHistoryTabs.displayName = "QueueHistoryTabs";

/**
 * Renders the queue and history tabs.
 *
 * @extends FlexProps Additional props to configure the parent container.
 * @returns {JSX.Element} The queue and history tabs.
 */
export const QueueHistoryTabs = memo(_QueueHistoryTabs);