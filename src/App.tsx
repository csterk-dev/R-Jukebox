
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { PageHeader } from "components/molecules/PageHeader";
import { theme } from "./theme";
import { CurrentVideo } from "components/atoms/CurrentVideo";
import { QueueHistoryTabs } from "components/molecules/QueueHistoryTabs";
import { PageContainer } from "components/templates/PageContainer";


const headerHeight = 60;
const controlBarHeight = 50;


export const App = () => {
  const dimensions = useWindowDimensions();

  return (
    <ChakraProvider theme={theme}>
      <PageContainer mb="10px">
        {/* Header */}
        <PageHeader height={`${headerHeight}px`} />
        
        {/* Body Content */}
        <Flex
          flexDirection={dimensions.width < 800 ? "column" : "row"}
          gap="10px"
          height={dimensions.height - headerHeight - controlBarHeight}
          justifyContent="space-between"
          // p="10px"
          mt="10px"
        >
          {/* Video Thumbnail & Metadata Container */}
          <CurrentVideo />

          {/* Queue & History Container */}
          <Flex flex={1} justifyContent={dimensions.width < 800 ? "center" : "flex-start"} pb={dimensions.width < 800 ? "10px" : 0}>
            <QueueHistoryTabs />
          </Flex>
        </Flex>
      </PageContainer>
    </ChakraProvider>
  )
}