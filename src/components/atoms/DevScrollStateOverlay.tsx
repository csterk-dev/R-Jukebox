import { Badge, HStack, Stack, StackProps, Text } from "@chakra-ui/react";
import { FC } from "react";

type DevScrollStateOverlayProps = StackProps & {
  isAtTopOfPage: boolean;
  isAtBottomOfPage: boolean;
  isScrolledPastCurrentVideo: boolean;
  showScrollToTopButton: boolean;
  isLandscape: boolean;
}

/** Renders an overlay with the current val of the provided states. */
export const DevScrollStateOverlay: FC<DevScrollStateOverlayProps> = ({ isAtTopOfPage, isAtBottomOfPage, isScrolledPastCurrentVideo, showScrollToTopButton, isLandscape, ...props }) => (
  <Stack
    bg="surface.foreground-transparent"
    position="fixed"
    px={2}
    py={1}
    top={20}
    zIndex="overlay"
    {...props}
  >
    <HStack justify="space-between">
      <Text>isAtTopOfPage</Text>
      <Badge colorPalette={isAtTopOfPage ? "green" : "yellow"}>{`${isAtTopOfPage}`}</Badge>
    </HStack>
    <HStack justify="space-between">
      <Text>isAtBottomOfPage</Text>
      <Badge colorPalette={isAtBottomOfPage ? "green" : "yellow"}>{`${isAtBottomOfPage}`}</Badge>
    </HStack>
    <HStack justify="space-between">
      <Text>isScrolledPastCurrentVideo</Text>
      <Badge colorPalette={isScrolledPastCurrentVideo ? "green" : "yellow"}>{`${isScrolledPastCurrentVideo}`}</Badge>
    </HStack>
    <HStack justify="space-between">
      <Text>showScrollToTopButton</Text>
      <Badge colorPalette={showScrollToTopButton ? "green" : "yellow"}>{`${showScrollToTopButton}`}</Badge>
    </HStack>
    <HStack justify="space-between">
      <Text>isLandscape</Text>
      <Badge colorPalette={isLandscape ? "green" : "yellow"}>{`${isLandscape}`}</Badge>
    </HStack>
  </Stack>
)