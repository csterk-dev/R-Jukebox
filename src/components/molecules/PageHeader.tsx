import { Box, BoxProps, Flex, FlexProps, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Kbd, Modal, ModalBody, ModalContent, ModalOverlay, Spacer, Text, useColorModeValue, useDisclosure, VStack } from "@chakra-ui/react";
import { FC, KeyboardEvent, memo, useEffect, useRef } from "react";
import { HiCog6Tooth, HiMagnifyingGlass, HiSpeakerWave, HiXMark } from "react-icons/hi2";
import { ColorModeSwitcher } from "../atoms/ColorModeSwitcher";
import { VideoCard } from "components/atoms/VideoCard";
import { VideoControls } from "components/atoms/VideoControls";


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
          gap="5px"
          justify="center"
          px="5px"
          width="100%"
          {...props}
        >
          <VideoControls flex={1} />
          <SearchBar
            flex={{
              base: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 1
            }}
            onOpen={onOpen}
          />
          <Flex
            flex={1}
            gap="5px"
            justifyContent="center"
          >
            <ColorModeSwitcher />
            <IconButton
              aria-label="Adjust volume"
              colorScheme="purple"
              icon={<HiSpeakerWave />}
              variant="ghost"
            />
            <IconButton
              aria-label="Settings"
              colorScheme="purple"
              icon={<HiCog6Tooth />}
              variant="ghost"
            />
          </Flex>
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
      px="10px"
      onClick={onOpen}
      {...props}
    >
      <HStack gap={4}>
        <Icon aria-label="search icon" as={HiMagnifyingGlass} />
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