import { Box, BoxProps, HStack, Icon, IconButton, Kbd, Spacer, Text } from "@chakra-ui/react";
import { FC } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

type SearchBarBoxProps = BoxProps & {
  iconOnly?: boolean;
  onOpen: () => void
}

/**
 * Renders a input like styled box.
 * @returns {JSX.Element} The search bar box.
 */
export const SearchBarButton: FC<SearchBarBoxProps> = ({ iconOnly, onOpen, ...props }) => {


  if (iconOnly) return (
    <IconButton aria-label="Open search" size="md" onClick={onOpen}>
      <HiMagnifyingGlass />
    </IconButton>
  )
  return (
    <Box
      as="button"
      bg="surface.foreground"
      borderRadius="lg"
      boxShadow="md"
      height="40px"
      px={2}
      onClick={onOpen}
      {...props}
    >
      <HStack gap={4}>
        <Icon aria-label="Open search" as={HiMagnifyingGlass} />
        <Text color="fg.muted">Search</Text>
        <Spacer />
        <Kbd userSelect="none">⌘ K</Kbd>
      </HStack>
    </Box>
  );
}
SearchBarButton.displayName = "SearchBarButton";