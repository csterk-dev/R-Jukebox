import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, FlexProps, Icon, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { VideoCard } from "components/atoms/VideoCard";
import { FC, memo, useCallback, useMemo, useRef, useState } from "react"
import { IconType } from "react-icons";
import { HiClock, HiRectangleStack, HiXMark } from "react-icons/hi2";
import { useAppState } from "state/appContext";
import { usePlayer } from "state/playerContext";
import { videoPlayedAtToString } from "utils/misc";

type QueueHistoryProps = FlexProps;

const _QueueHistoryTabs: FC<QueueHistoryProps> = ({ ...props }) => {
  const foreground = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(13, 15, 24, 0.75)");
  const tabHeader = useColorModeValue("neutral.white", "neutral.900");
  const deleteQueueVidButton = useColorModeValue("neutral.900", "neutral.white");
  const { isMobile } = useAppState();
  const { history, queue, playVideo, addToBottomOfQueue, addToTopOfQueue, clearQueue, deleteQueueItem } = usePlayer();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { isOpen: isClearConfOpen, onOpen: onOpenClearConf, onClose: onCloseClearConf } = useDisclosure();
  const cancelClearButtonRef = useRef<HTMLButtonElement>(null);


  const historyCards: JSX.Element[] = useMemo(() => {
    type SortedHistory = { [key: string]: HistoryVideo[] }

    const sortedHistory = history.reduce((grouped: SortedHistory, video: HistoryVideo) => {
      const vidDate = video.playedDate;
      if (!grouped[vidDate]) grouped[vidDate] = [];

      grouped[vidDate].push(video);
      return grouped;
    }, {} as SortedHistory);

    const jsx: JSX.Element[] = [];
    Object.entries(sortedHistory).forEach(([date, videos]) => {
      const dateText = videoPlayedAtToString(date);
      jsx.push(
        <Flex
          key={dateText}
          flexDirection="column"
          gap="10px"
          width="100%"
        >
          <Text fontSize="12">{dateText}</Text>
          {videos.map(vid => (
            <VideoCard
              key={`${vid.videoId}${vid.playedAt}`}
              addToBottomOfQueue={addToBottomOfQueue}
              addToTopOfQueue={addToTopOfQueue}
              isMobile={isMobile}
              playVideo={playVideo}
              video={vid}
            />
          ))}
        </Flex>
      )
    })

    // Object.entries(sortedHistory).forEach(([date, videos]) => {
    //   jsx.push(
    //     <AccordionItem key={date} borderColor="transparent">
    //       {({ isExpanded }) => (
    //         <>
    //           <h3>
    //             <AccordionButton
    //               display="flex"
    //               flex="1"
    //               fontSize="12"
    //               justifyContent="space-between"
    //               p="10px"
    //             >
    //               <Text>{videoPlayedAtToString(date)}</Text>
    //               <Text>{!isExpanded ? "Show more" : "Hide"}</Text>
    //             </AccordionButton>
    //           </h3>
    //           <AccordionPanel px="10px" py={0}>
    //             <Flex flexDirection="column" gap="10px">
    //               {videos.map(vid => (
    //                 <VideoCard
    //                   key={`${vid.videoId}${vid.playedAt}`}
    //                   isMobile={isMobile}
    //                   playVideo={onClickHistoryVideo}
    //                   video={vid}
    //                 />
    //               ))}
    //             </Flex>
    //           </AccordionPanel>
    //         </>
    //       )}
    //     </AccordionItem>
    //   )
    // })

    return jsx;
  }, [history, isMobile, addToBottomOfQueue, addToTopOfQueue, playVideo]);


  const confirmClear = useCallback(() => {
    clearQueue();
    onCloseClearConf();
  }, [clearQueue, onCloseClearConf]);


  return (
    <>
      <Flex
        as="aside"
        bg={foreground}
        borderRadius={10}
        boxShadow="lg"
        height="100%"
        maxWidth={isMobile ? "300px" : "400px"}
        width="100%"
        {...props}
      >
        <Tabs
          colorScheme="purple"
          defaultIndex={0}
          display="flex"
          flexDirection="column"
          variant="soft-rounded"
          width="100%"
          isLazy
          onChange={useCallback((index: number) => setTabIndex(index), [])}
        >
          <TabList
            alignItems="center"
            bgColor={tabHeader}
            boxShadow="base"
            justifyContent="space-between"
            p="10px"
          >
            <Flex>
              <Tab color="current">Queue</Tab>
              <Tab color="current">History</Tab>
            </Flex>
            {tabIndex == 0 ? <Button size="sm" variant="ghost" onClick={onOpenClearConf}>Clear</Button> : null}
          </TabList>
          <TabPanels height="100%" overflowY="auto">
            <TabPanel height="100%" p="10px 10px 10px 0px">
              {queue.length === 0 ?
                <Placeholder icon={HiRectangleStack} pl="10px" title="Queued videos will appear here" /> :
                <Flex
                  flex={1}
                  flexDirection="column"
                  gap="10px"
                  pb="10px"
                >
                  {queue.map(vid => (
                    <Flex key={vid.videoId} alignItems="center">
                      <IconButton
                        aria-label="More options"
                        color={deleteQueueVidButton}
                        fontSize="18px"
                        icon={<HiXMark />}
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteQueueItem(vid.videoId)}
                      />
                      <VideoCard
                        addToBottomOfQueue={addToBottomOfQueue}
                        addToTopOfQueue={addToTopOfQueue}
                        isMobile={isMobile}
                        playVideo={playVideo}
                        video={vid}
                      />
                    </Flex>
                  ))}
                </Flex>
              }
            </TabPanel>
            <TabPanel height="100%" p="10px">
              {history.length === 0 ?
                <Placeholder icon={HiClock} title="History will appear here" /> :
                <Flex
                  flex={1}
                  flexDirection="column"
                  gap="10px"
                  pb="10px"
                >
                  {historyCards}
                </Flex>
              }
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>

      <AlertDialog
        isOpen={isClearConfOpen}
        leastDestructiveRef={cancelClearButtonRef}
        size="xs"
        onClose={onCloseClearConf}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader p="10px 20px 0px">
              Clear queue?
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure that you want to clear all videos in the queue?
            </AlertDialogBody>

            <AlertDialogFooter px="10px" width="100%">
              <Button
                size="sm"
                variant="destructive"
                width="100%"
                onClick={confirmClear}
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


type PlaceholderProps = FlexProps & {
  title: string;
  icon: IconType;
}

const Placeholder: FC<PlaceholderProps> = ({ title, icon, ...props }) => {
  const iconBg = useColorModeValue("neutral.white", "neutral.400");

  return (
    <Flex
      alignItems="center"
      flexDir="column"
      gap="10px"
      justifyContent="center"
      {...props}
    >
      <Box
        background={iconBg}
        borderRadius="90"
        p="20px"
      >
        <Icon
          as={icon}
          fontSize="70px"
        />
      </Box>
      <Text fontSize="18px" fontWeight="600" opacity={0.7}>{title}</Text>
    </Flex>
  )
}



/**
 * Need to add queue video variant
 * - Update how history is retrieved and set to match queue - hope that fixes bug
 */