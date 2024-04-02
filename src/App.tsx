
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { PageBackground } from "components/atoms/PageBackground";
import { PageHeader } from "components/molecules/PageHeader";
import { theme } from "./theme";
import { CurrentVideo } from "components/atoms/CurrentVideo";
import { QueueHistoryTabs } from "components/molecules/QueueHistoryTabs";



export const App = () => {
  const dimensions = useWindowDimensions();
  const headerHeight = 60;


  return (
    <ChakraProvider theme={theme}>
      <PageBackground>
        <PageHeader height={`${headerHeight}px`} />
        <Flex
          flexDirection={{
            base: "row",
            sm: "column",
            md: "column",
            lg: "row"
          }}
          height={dimensions.height - headerHeight}
          justifyContent="space-between"
        >
          {/* Video Thumbnail & Metadata Container */}
          <CurrentVideo />

          {/* Queue & History Container */}
          <Flex
            flex={1}
            justifyContent="center"
            p="10px"
          >
            <QueueHistoryTabs />
          </Flex>
        </Flex>
      </PageBackground>
    </ChakraProvider>
  )
}
