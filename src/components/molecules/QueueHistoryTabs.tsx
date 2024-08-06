import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, FlexProps, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from "@chakra-ui/react";
import { VideoCard } from "components/atoms/VideoCard";
import { FC, memo, useCallback, useMemo } from "react"
import { IconType } from "react-icons";
import { HiRectangleStack, HiStar } from "react-icons/hi2";
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
        <AccordionItem key={date} borderColor="transparent">
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
          <TabPanel
            height="100%"
            p={0}
            px="10px"
            py="10px"
          >
            <Placeholder icon={HiStar} mt="10px" title="Queue coming soon" />
          </TabPanel>
          <TabPanel p={0} py="0px">
            {history.length === 0 ?
              <Placeholder icon={HiRectangleStack} mt="20px" title="History will appear here" /> :
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
      height="100%"
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