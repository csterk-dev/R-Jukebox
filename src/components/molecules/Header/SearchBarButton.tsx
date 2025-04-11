import { Box, BoxProps, HStack, Icon, IconButton, Kbd, Spacer, Text } from "@chakra-ui/react";
import { FC } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

type SearchBarBoxProps = BoxProps & {
  isMobile: boolean;
  onOpen: () => void
}

/**
 * Renders a input like styled box.
 * @returns {JSX.Element} The search bar box.
 */
export const SearchBarButton: FC<SearchBarBoxProps> = ({ isMobile, onOpen, ...props }) => {


  if (isMobile) return (
    <IconButton
      aria-label="Open search"
      colorScheme="brand"
      icon={<HiMagnifyingGlass />}
      size="md"
      onClick={onOpen}
    />
  )
  return (
    <Box
      _dark={{ bg: "neutral.700" }}
      as="button"
      bg="white"
      borderRadius={8}
      boxShadow="base"
      height="40px"
      px="10px"
      onClick={onOpen}
      {...props}
    >
      <HStack gap={4}>
        <Icon aria-label="Open search" as={HiMagnifyingGlass} />
        <Text opacity={0.7}>Search</Text>
        <Spacer />
        <Kbd userSelect="none">⌘ K</Kbd>
      </HStack>
    </Box>
  );
}
SearchBarButton.displayName = "SearchBarButton";