import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Flex, FlexProps, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from "@chakra-ui/react";
import { VideoCard } from "components/atoms/VideoCard";
import { FC, memo, useCallback, useMemo } from "react"
import { useAppState } from "state/appContext";
import { usePlayer } from "state/playerContext";
import { videoPlayedAtToString } from "utils/misc";

type QueueHistoryProps = FlexProps;

const _QueueHistoryTabs: FC<QueueHistoryProps> = ({ ...props }) => {
  const foreground = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(13, 15, 24, 0.75)");
  const tabHeader = useColorModeValue("neutral.white", "neutral.900");
  const { isMobile } = useAppState();
  const { history, playVideo } = usePlayer();


  /** Callback to play the selected video from the history. */
  const onClickHistoryVideo = useCallback((video: Video) => {
    playVideo(video);
  }, [playVideo]);


  type SortedHistory = {
    [key: string]: HistoryVideo[];
  }

  const historyCards: JSX.Element[] = useMemo(() => {
    const sortedHistory = history.reduce((grouped: SortedHistory, video: HistoryVideo) => {
      const vidDate = video.playedDate;
      if (!grouped[vidDate]) grouped[vidDate] = [];

      grouped[vidDate].push(video);
      return grouped;
    }, {} as SortedHistory);

    const jsx: JSX.Element[] = [];
    Object.entries(sortedHistory).forEach(([date, videos]) => {
      jsx.push(
        <AccordionItem borderColor="transparent">
          {({ isExpanded }) => (
            <>
              <h3>
                <AccordionButton
                  display="flex"
                  flex="1"
                  fontSize="12"
                  justifyContent="space-between"
                  p="10px"
                >
                  <Text>{videoPlayedAtToString(date)}</Text>
                  <Text>{!isExpanded ? "Show more" : "Hide"}</Text>
                </AccordionButton>
              </h3>
              <AccordionPanel px="10px" py={0}>
                <Flex flexDirection="column" gap="10px">
                  {videos.map(vid => (
                    <VideoCard
                      key={`${vid.videoId}${vid.playedAt}`}
                      isMobile={isMobile}
                      playVideo={onClickHistoryVideo}
                      video={vid}
                    />
                  ))}
                </Flex>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      )
    })

    return jsx;
  }, [isMobile, onClickHistoryVideo, history]);


  return (
    <Flex
      as="aside"
      bg={foreground}
      borderRadius={10}
      boxShadow="lg"
      height="100%"
      maxWidth={isMobile ? "300px" : "400px"}
      overflowY="auto"
      width="100%"
      {...props}
    >
      <Tabs
        colorScheme="purple"
        defaultIndex={1}
        variant="soft-rounded"
        width="100%"
        isLazy
      >
        <TabList bgColor={tabHeader} boxShadow="base" p="10px">
          <Tab color="current">Queue</Tab>
          <Tab color="current">History</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} px="10px" py="10px">
            <p>Coming soon</p>
          </TabPanel>
          <TabPanel p={0} py="0px">
            {history.length === 0 ?
              <p>Nothing to display</p> :
              <Accordion
                defaultIndex={[0]}
                variant="unstyled"
                allowMultiple
              >
                {historyCards}
              </Accordion>
            }
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
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