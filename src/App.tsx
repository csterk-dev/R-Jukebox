
import { ChakraProvider, Flex, useMediaQuery } from "@chakra-ui/react";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { PageHeader } from "components/molecules/PageHeader";
import { theme } from "./theme";
import { CurrentVideo } from "components/atoms/CurrentVideo";
import { QueueHistoryTabs } from "components/molecules/QueueHistoryTabs";
import { PageContainer } from "components/templates/PageContainer";
import { PlayerProvider } from "state/playerContext";
import { HEADER_HEIGHT } from "./constants";


const controlBarHeight = 50;


export const App = () => {
  const dimensions = useWindowDimensions();
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  return (
    <ChakraProvider theme={theme}>
      <PlayerProvider>
        <PageContainer mb="10px">
          {/* Header */}
          <PageHeader height={`${HEADER_HEIGHT}px`} />

          {/* Body Content */}
          <Flex
            flexDirection={!isLargerThan800 ? "column" : "row"}
            gap="10px"
            height={dimensions.height - HEADER_HEIGHT - controlBarHeight}
            justifyContent="space-between"
            mt="10px"
          >
            {/* Video Thumbnail & Metadata Container */}
            <CurrentVideo
              flex={{
                base: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 2,
                "2xl": 2.5
              }}
            />

            {/* Queue & History Container */}
            <Flex flex={1} justifyContent={!isLargerThan800 ? "center" : "flex-start"} pb={!isLargerThan800 ? "10px" : 0}>
              <QueueHistoryTabs />
            </Flex>
          </Flex>
        </PageContainer>
      </PlayerProvider>
    </ChakraProvider>
  )
}