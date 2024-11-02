import { ChakraProvider, Flex, useMediaQuery } from "@chakra-ui/react";
import { PageHeader } from "components/molecules/PageHeader";
import { theme } from "./theme";
import { CurrentVideo } from "components/atoms/CurrentVideo";
import { QueueHistoryTabs } from "components/molecules/QueueHistoryTabs";
import { PageContainer } from "components/templates/PageContainer";
import { PlayerProvider } from "state/playerContext";
import { HEADER_HEIGHT } from "./constants";
import { AppProvider } from "state/appContext";
import "theme/styles.css";

export const App = () => {
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  return (
    <ChakraProvider theme={theme}>
      <AppProvider>
        <PlayerProvider>
          <PageContainer>

            <PageHeader height={`${HEADER_HEIGHT}px`} />

            <Flex
              flexDirection={!isLargerThan800 ? "column" : "row"}
              gap="10px"
              height={`calc(100% - ${HEADER_HEIGHT}px)`}
              justifyContent="space-between"
              pb="20px"
              pt="10px"
            >
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
              <Flex flex={1} justifyContent={!isLargerThan800 ? "center" : "flex-start"} pb={!isLargerThan800 ? "40px" : 0}>
                <QueueHistoryTabs />
              </Flex>
            </Flex>
            
          </PageContainer>
        </PlayerProvider>
      </AppProvider>
    </ChakraProvider>
  )
}