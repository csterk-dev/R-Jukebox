import { Flex, FlexProps, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from "@chakra-ui/react";
import { FC, memo } from "react"
import { useAppState } from "state/appContext";


type QueueHistoryProps = FlexProps;

const _QueueHistoryTabs: FC<QueueHistoryProps> = ({ ...props }) => {
  const foreground = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(13, 15, 24, 0.75)");
  const tabHeader = useColorModeValue("neutral.white", "neutral.900");
  const { isMobile } = useAppState();


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
        variant="soft-rounded"
        width="100%"
        isLazy
      >
        <TabList bgColor={tabHeader} boxShadow="base" p="10px">
          <Tab color="current">Queue</Tab>
          <Tab color="current">History</Tab>
        </TabList>
        <TabPanels px="10px">
          <TabPanel p={0} py="10px">
            <p>Coming soon</p>
          </TabPanel>
          <TabPanel p={0} py="10px">
            <p>Coming soon</p>
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