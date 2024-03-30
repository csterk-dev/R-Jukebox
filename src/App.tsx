
import { Box, ChakraProvider, Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from "@chakra-ui/react";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { PageBackground } from "components/atoms/PageBackground";
import { PageHeader } from "components/atoms/PageHeader";
import { theme } from "./theme";



export const App = () => {
  const dimensions = useWindowDimensions();
  const headerHeight = 60;
  const childrenBg = useColorModeValue("neutral.white", "neutral.900");

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
          <Flex
            flex={{
              base: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 2
            }}
            justifyContent="center"
            p="10px"
          >
            <Flex flexDir="column">
              <Flex
                alignItems="center"
                bg="neutral.dark"
                borderRadius={10}
                height={dimensions.width / 3}
                justifyContent="center"
                minHeight="400px"
                minWidth="400px"
                position="relative"
                width={dimensions.width / 3}
              >
                <Box
                  aspectRatio={1}
                  bg="url('https://img.youtube.com/vi/uLxD4ozDPZA/hq720.jpg') center/cover no-repeat"
                  filter="blur(10px)"
                  position="absolute"
                  width="98%"
                />
                <Image
                  aria-label="Video thumbnail"
                  borderRadius={10}
                  src="https://img.youtube.com/vi/uLxD4ozDPZA/hq720.jpg"
                  width="50%"
                  zIndex={100}
                />
              </Flex>
              <Flex
                bg={childrenBg}
                borderRadius={10}
                boxShadow="lg"
                mt="10px"
                p="10px"
                position="relative"
              >
                Song Title
              </Flex>
            </Flex>
          </Flex>

          {/* Queue & History Container */}
          <Flex
            flex={1}
            justifyContent="center"
            p="10px"
          >
            <Flex
              bg={childrenBg}
              borderRadius={10}
              boxShadow="lg"
              height="100%"
              maxWidth="400px"
              overflowY="auto"
              p="10px"
              width="100%"
            >
              <Tabs colorScheme="purple" variant="soft-rounded">
                <TabList>
                  <Tab>Queue</Tab>
                  <Tab>History</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box
                      bg="orange" height="100px" mb="2"
                      width="50px" />
                    <Box
                      bg="orange" height="100px" mt="2"
                      width="50px" />
                    <Box
                      bg="orange" height="100px" mt="2"
                      width="50px" />
                    <Box
                      bg="orange" height="100px" mt="2"
                      width="50px" />
                    <Box
                      bg="orange" height="100px" mt="2"
                      width="50px" />
                    <Box
                      bg="orange" height="100px" mt="2"
                      width="50px" />
                    <Box
                      bg="orange" height="100px" mt="2"
                      width="50px" />
                  </TabPanel>
                  <TabPanel>
                    <p>two!</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </Flex>
        </Flex>
      </PageBackground>
    </ChakraProvider>
  )
}
