import { Button, ButtonProps, Icon, IconButton, Kbd, Spacer, Text } from "@chakra-ui/react";
import { FC } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

type SearchBarBoxProps = ButtonProps & {
  iconOnly?: boolean;
}

/**
 * Renders a input like styled box.
 * @returns {JSX.Element} The search bar box.
 */
export const SearchBarButton: FC<SearchBarBoxProps> = ({ iconOnly, ...props }) => {

  if (iconOnly) return (
    <IconButton aria-label="Open search" size="md" {...props}>
      <HiMagnifyingGlass />
    </IconButton>
  )
  return (
    <Button
      as="button"
      bg="surface.foreground"
      borderRadius="lg"
      boxShadow="md"
      gap={4}
      height="40px"
      justifyContent="flex-start"
      px={2}
      {...props}
    >
      <Icon aria-label="Open search" as={HiMagnifyingGlass} />
      <Text color="fg.muted">Search</Text>
      <Spacer />
      <Kbd userSelect="none">⌘ K</Kbd>
    </Button>
  );
}
SearchBarButton.displayName = "SearchBarButton";