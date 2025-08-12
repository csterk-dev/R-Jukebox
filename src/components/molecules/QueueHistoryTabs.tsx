import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Circle, Divider, Flex, FlexProps, FormControl, FormLabel, IconButton, Input, InputGroup, InputRightElement, Select, Spinner, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip, useDisclosure, usePrevious } from "@chakra-ui/react";
import { Placeholder } from "components/atoms/Placeholder";
import { VideoCard } from "components/atoms/VideoCard";
import { ChangeEvent, Dispatch, FC, FormEvent, memo, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiClock, HiFaceFrown, HiRectangleStack, HiXMark } from "react-icons/hi2";
import { useAppState } from "state/appContext";
import { usePlayer } from "state/playerContext";
import { usePaginatedListHistory } from "state/swr";
import { HistorySortTypes } from "utils/api";
import { ISO8601ToSeconds, secondsToString, videoPlayedAtToString } from "utils/misc";


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
  /** Indicates when at bottom of the page. */
  isAtBottomOfPage: boolean;
  /** Callback for the global bottom state. */
  setIsAtBottomOfPage: Dispatch<SetStateAction<boolean>>;
  /** Value determined by viewport media query. */
  isLandscape: boolean;
};

const _QueueHistoryTabs: FC<QueueHistoryProps> = ({ setIsAtBottomOfPage: setIsNearBottomOfPage, isAtBottomOfPage, isLandscape, ...props }) => {
  const { queue, playVideo, addToBottomOfQueue, addToTopOfQueue, clearQueue, deleteQueueItem } = usePlayer();
  const { showDevDebugging } = useAppState();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { isOpen: isClearConfOpen, onOpen: onOpenClearConf, onClose: onCloseClearConf } = useDisclosure();
  const { isOpen: isHistoryOptionsOpen, onOpen: onOpenHistoryOptions, onClose: onCloseHistoryOptions } = useDisclosure();
  const cancelClearButtonRef = useRef<HTMLButtonElement>(null);
  const cancelHistoryOotionsButtonRef = useRef<HTMLButtonElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const historyPanelRef = useRef<HTMLDivElement>(null);
  /** Used to clear the focus when the modal closes (so it doesn't highlight the button - default behaviour) */
  const finalFocusRef = useRef(null);
  const { isMobile } = useAppState();
  const hasHistoryTabFocused = tabIndex === 1;
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
  } = usePaginatedListHistory();

  /** Returns a single array of all history items for rendering. */
  const allHistoryVideos: HistoryVideo[] = useMemo(() => {
    if (!historyPages) return [];
    return historyPages.flat();
  }, [historyPages]);



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
              playVideo={playVideo}
              video={vid}
            />
          ))}
        </Stack>
      )
    });

    return jsx;
  }, [allHistoryVideos, isMobile, playVideo, addToBottomOfQueue, addToTopOfQueue]);


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
        maxWidth={isMobile ? "300px" : "400px"}
        overflow="clip"
        width="100%"
        {...props}
      >
        <Tabs
          colorScheme="brand"
          defaultIndex={0}
          display="flex"
          flexDirection="column"
          variant="soft-rounded"
          width="100%"
          onChange={useCallback((index: number) => setTabIndex(index), [])}
        >
          <TabList
            alignItems="center"
            bg="surface.solid"
            boxShadow="base"
            justifyContent="space-between"
            p={2}
          >
            <Flex>
              <Tab color="text.body">Queue</Tab>
              <Tab
                color="text.body"
                onClick={useCallback(() => {
                  setIsNearBottomOfPage(false);
                  onClickScrollToTop();
                }, [onClickScrollToTop, setIsNearBottomOfPage])}
              >
                History
              </Tab>
            </Flex>
            {tabIndex === 0 ?
              <Button isDisabled={queue.length === 0} onClick={onOpenClearConf}>
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
          </TabList>
          <TabPanels
            height="100%"
            layerStyle="themed-scroll"
            overflowY="auto"
            ref={panelsRef}
          >
            <TabPanel height="100%" p="8px 8px 8px 0px">
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
                      <Tooltip label="Remove item" placement="left">
                        <IconButton
                          _dark={{ color: "base.white" }}
                          aria-label="More options"
                          color="neutral.900"
                          fontSize="18px"
                          icon={<HiXMark />}
                          onClick={() => deleteQueueItem(vid.videoId)}
                        />
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
            </TabPanel>

            <TabPanel
              height="100%"
              pl={2}
              pr={1}
              py={2}
              ref={historyPanelRef}
            >
              {!allHistoryVideos.length && !isLoading && !isValidating ? (
                <Placeholder icon={hasHistoryOptionsEnabled ? HiFaceFrown : HiClock} mb={5} title={hasHistoryOptionsEnabled ? "No history videos match those options" : "History will appear here"} />
              ) : (
                <Stack as="ol" flex={1} pb={1}>
                  {historyCards}

                  {error ?
                    <Text color="text.error" textAlign="center">
                      Error loading history.
                    </Text> :

                    isValidating ?
                      <Box mx="auto" pt={1}>
                        <Spinner size="sm" />
                      </Box> :

                      !hasMore ?
                        <Text color="text.subtle" textAlign="center">
                          {searchTerm ? "No more videos to display" : "You've reached the end of the history"}
                        </Text> :
                        null
                  }
                </Stack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>

      <AlertDialog
        finalFocusRef={finalFocusRef}
        isOpen={isClearConfOpen}
        leastDestructiveRef={cancelClearButtonRef}
        size="xs"
        onClose={onCloseClearConf}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              <h1>Clear queue?</h1>
            </AlertDialogHeader>

            <AlertDialogBody gap={4}>
              Are you sure that you want to clear all videos in the queue?
              <Divider />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                size="sm"
                variant="destructive"
                width="100%"
                onClick={onClickConfirmClear}
              >
                Clear
              </Button>
              <Button
                ref={cancelClearButtonRef}
                size="sm"
                variant="outline"
                width="100%"
                onClick={onCloseClearConf}
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>


      <AlertDialog
        finalFocusRef={finalFocusRef}
        isOpen={isHistoryOptionsOpen}
        leastDestructiveRef={cancelHistoryOotionsButtonRef}
        size="xs"
        onClose={onCloseHistoryOptions}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <form onSubmit={handleSubmitHistoryOptions}>
              <AlertDialogHeader>
                <h1>History View Options</h1>
              </AlertDialogHeader>

              <AlertDialogBody gap={4}>
                <FormControl>
                  <FormLabel color="text.subtle">Sort by</FormLabel>
                  <Select
                    focusBorderColor="brand.500"
                    value={historySortInputVal}
                    variant="outline"
                    onChange={useCallback((e: ChangeEvent<HTMLSelectElement>) => setHistorySortInputVal(e.target.value as HistorySortTypes), [])}
                  >
                    {HISTORY_SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel color="text.subtle">Search term</FormLabel>
                  <InputGroup>
                    <Input
                      enterKeyHint="done"
                      focusBorderColor="brand.500"
                      placeholder="Search by video title or channel"
                      value={historySearchInputVal}
                      variant="outline"
                      onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setHistorySearchInputVal(e.target.value), [setHistorySearchInputVal])}
                    />
                    <InputRightElement mr={3}>
                      <Button
                        colorScheme="brand"
                        display={historySearchInputVal ? "inline-block" : "none"}
                        size="sm"
                        variant="link"
                        onClick={useCallback(() => setHistorySearchInputVal(""), [])}
                      >
                        Clear
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Divider />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  isDisabled={isValidating || isLoading}
                  isLoading={isValidating || isLoading}
                  type="submit"
                  variant="brand"
                  width="100%"
                >
                  Apply
                </Button>
                <Button
                  ref={cancelHistoryOotionsButtonRef}
                  variant="outline"
                  width="100%"
                  onClick={onCloseHistoryOptions}
                >
                  Close
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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