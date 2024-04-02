import { Box, Flex, FlexProps, HStack, Image, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { useWindowDimensions } from "@usesoftwareau/react-utils";
import { FC, memo } from "react";


type CurrentVideoProps = FlexProps & {
  currentVideo?: YoutubeVideo;
}

const _CurrentVideo: FC<CurrentVideoProps> = ({ }) => {
  const foreground = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(13, 15, 24, 0.75)");
  const dimensions = useWindowDimensions();


  return (
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
          height={dimensions.height < 600 ? "100%" : dimensions.width / 3}
          justifyContent="center"
          minHeight="400px"
          minWidth="400px"
          position="relative"
          width={dimensions.width / 3}
        >
          <Box
            bg="url('https://img.youtube.com/vi/uLxD4ozDPZA/hq720.jpg') center/cover no-repeat"
            borderRadius={10}
            filter="blur(10px)"
            height="95%"
            position="absolute"
            width="95%"
          />
          <Image
            aria-label="Video thumbnail"
            borderRadius={10}
            src="https://img.youtube.com/vi/uLxD4ozDPZA/hq720.jpg"
            width="75%"
            zIndex={100}
          />

          <Text
            bgColor={foreground}
            borderRadius={4}
            bottom="10px"
            pb="2px"
            position="absolute"
            px="8px"
            right="10px"
            textAlign="center"
          >
            1:24:09
          </Text>

        </Flex>

        {/* Current song info */}
        <Flex
          bgColor={foreground}
          borderRadius={10}
          boxShadow="lg"
          flexDir="column"
          minWidth="400px"
          mt="10px"
          p="10px"
          width={dimensions.width / 3}
          zIndex={100}
        >
          <Flex
            alignItems="center"
            fontSize="14"
            fontWeight="500"
            justifyContent="space-between"
            textTransform="uppercase"
          >
            <Text>Current Song</Text>
            <Tag bg="red.500" color="white">• Live</Tag>
          </Flex>
          <Text
            as="h2"
            fontSize="20"
            fontWeight="600"
            noOfLines={2}
            textOverflow="ellipsis"
          >
            Jungle drum & bass liquid funk mix this is a really long string it shold break
          </Text>
          <HStack
            fontSize="18"
            fontWeight="400"
          >
            <Text>
              Loopy Longplays
            </Text>
            <Text>
              •
            </Text>
            <Text>
              28 Aug 2022
            </Text>
            <Text>
              •
            </Text>
            <Text>
              236k views
            </Text>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  )
}
_CurrentVideo.displayName = "CurrentVideo";

export const CurrentVideo = memo(_CurrentVideo);