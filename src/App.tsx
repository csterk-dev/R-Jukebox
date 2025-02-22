import { ChakraProvider, Flex } from "@chakra-ui/react";
import { theme } from "./theme";
import { CurrentVideo } from "components/atoms/CurrentVideo";
import { QueueHistoryTabs } from "components/molecules/QueueHistoryTabs";
import { PageContainer } from "components/templates/PageContainer";
import { PlayerProvider } from "state/playerContext";
import { AppProvider } from "state/appContext";

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <AppProvider>
        <PlayerProvider>
          <PageContainer>
            <Flex
              flexDirection={{
                base: "column",
                lg: "row"
              }}
              gap="10px"
              justifyContent="space-between"
              py="10px"
            >
              <CurrentVideo
                flex={{
                  base: 1,
                  xl: 2,
                  "2xl": 2.5
                }}
              />
              <Flex
                bg="oranges" 
                flex={1} 
                justifyContent={{
                  base: "center",
                  lg: "flex-start"
                }} 
              >
                <QueueHistoryTabs />
              </Flex>
            </Flex>
          </PageContainer>
        </PlayerProvider>
      </AppProvider>
    </ChakraProvider>
  )
}