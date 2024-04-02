import { Flex, FlexProps, HStack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { FC, memo } from "react";


type VideoCardProps = FlexProps & {
  video?: YoutubeVideo;
}

const _VideoCard: FC<VideoCardProps> = ({ ...props }) => {
  const foreground = useColorModeValue("neutral.white", "neutral.900");


  return (
    <Flex
      _hover={{ cursor: "pointer" }}
      bgColor={foreground}
      borderRadius={5}
      boxShadow="base"
      flexDir="row"
      height="100px"
      width="100%"
      {...props}
    >
      <Flex
        alignItems="center"
        bg="neutral.dark"
        borderRadius={5}
        height="100%"
        justifyContent="center"
        position="relative"
        width="200px"
      >
        <Image
          aria-label="Video thumbnail"
          bg="neutral.dark"
          borderRadius={5}
          height="100%"
          objectFit="cover"
          position="relative"
          src="https://img.youtube.com/vi/uLxD4ozDPZA/hq720.jpg"
          width="100%"
        />
        <Text
          bgColor={foreground}
          borderRadius={4}
          bottom="4px"
          fontSize="14"
          position="absolute"
          px="4px"
          right="2px"
          textAlign="center"
        >
          1:24:09
        </Text>
      </Flex>

      <Flex
        borderRadius={10}
        flexDir="column"
        justifyContent="space-between"
        px="10px"
        py="5px"
      >
        <Text
          as="h4"
          fontSize="14"
          fontWeight="600"
          noOfLines={2} 
          textOverflow="ellipsis"
        >
          Jungle drum & bass liquid funk mix this is really
        </Text>
        <Text fontSize="14" noOfLines={1} textOverflow="ellipsis">
          Loopy Longplays
        </Text>
        <HStack fontSize="14" fontWeight="400">
          <Text>
            240k views
          </Text>
          <Text>
            •
          </Text>
          <Text>
            28 Aug 2022
          </Text>
        </HStack>
      </Flex>
    </Flex>
  )
}
_VideoCard.displayName = "VideoCard";

export const VideoCard = memo(_VideoCard);