import { Box, BoxProps, Flex, FlexProps, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Kbd, Modal, ModalBody, ModalContent, ModalOverlay, Spacer, Text, useColorModeValue, useDisclosure, VStack } from "@chakra-ui/react";
import { FC, KeyboardEvent, memo, useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { ColorModeSwitcher } from "../atoms/ColorModeSwitcher";
import { VideoCard } from "components/atoms/VideoCard";


const _PageHeader: FC<FlexProps> = (props) => {
  const headerBg = useColorModeValue("white", "neutral.900");
  const searchBg = useColorModeValue("white", "neutral.700");
  const modalBg = useColorModeValue("neutral.offWhite", "neutral.700");

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Used to clear the focus when the modal closes (so it doesn't highlight the button - default behaviour)
  const finalFocusRef = useRef(null)  

  useEffect(() => {
    const handleKeyDown: EventListener = (event) => {
      if ((event as unknown as KeyboardEvent).metaKey && (event as unknown as KeyboardEvent).key === "k") {
        if (!isOpen) onOpen();
        else onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onOpen]);

  return (
    <>
      <header>
        <Flex
          alignItems="center"
          background={headerBg}
          boxShadow="base"
          justify="center"
          width="100%"
          {...props}
        >
          <SearchBar onOpen={onOpen} />
          <ColorModeSwitcher />
        </Flex>
      </header>

      <Modal
        finalFocusRef={finalFocusRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow={0}>
          <InputGroup>
            <InputLeftElement>
              <Icon
                aria-label="search icon"
                as={HiMagnifyingGlass}
                pointerEvents="none"
              />
            </InputLeftElement>
            <Input
              bg={searchBg}
              borderRadius={10}
              boxShadow="md"
              height="40px"
              placeholder="Search"
              px="10px"
              variant="unstyled"
              width="100%"
              autoFocus
            />
            <InputRightElement>
              <IconButton
                aria-label="Close search"
                icon={<HiXMark />}
                variant="ghost"
                onClick={onClose}
              />
            </InputRightElement>
          </InputGroup>

          <ModalBody
            bg={modalBg}
            mt="10px"
          >
            <VStack>
              <VideoCard />
              <VideoCard />
              <VideoCard />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
_PageHeader.displayName = "PageHeader";

/**
 * The page header contains a search bar and app settings menu.
 * 
 * @extends FlexProps Props to configure the container.
 * @returns {JSX.Element} The page header component.
 */
export const PageHeader = memo(_PageHeader);



const SearchBar: FC<BoxProps & { onOpen: () => void }> = ({ onOpen, ...props }) => {
  const bg = useColorModeValue("white", "neutral.700");

  return (
    <Box
      as="button"
      bg={bg}
      borderRadius={10}
      boxShadow="base"
      height="40px"
      minWidth="300px"
      px="10px"
      width="20%"
      onClick={onOpen}
      {...props}
    >
      <HStack gap={4}>
        <Icon
          aria-label="search icon"
          as={HiMagnifyingGlass}
        />
        <Text>Search</Text>
        <Spacer />
        <HStack gap={1}>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </HStack>
      </HStack>
    </Box>
  )
}