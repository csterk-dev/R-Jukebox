import { Box, BoxProps, Flex, FlexProps, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Kbd, Modal, ModalBody, ModalContent, ModalOverlay, Progress, Spacer, Text, Tooltip, useColorModeValue, useDisclosure, VStack } from "@chakra-ui/react";
import { FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { HiChartBar, HiCog6Tooth, HiMagnifyingGlass, HiSpeakerWave, HiXMark } from "react-icons/hi2";
import { ColorModeSwitcher } from "../atoms/ColorModeSwitcher";
import { VideoCard } from "components/atoms/VideoCard";
import { VideoControls } from "components/atoms/VideoControls";
import { useDebounce } from "@usesoftwareau/react-utils";
import { useYoutubeSearch } from "utils/hooks";
import { usePlayer } from "state/playerContext";
import { TooltipOpenDelay } from "../../constants";


const noOfResults = 40;


const _PageHeader: FC<FlexProps> = (props) => {
  const headerBg = useColorModeValue("white", "neutral.900");
  const searchBg = useColorModeValue("white", "neutral.700");
  const modalBg = useColorModeValue("neutral.offWhite", "neutral.700");

  // Search bar and results disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Used to clear the focus when the modal closes (so it doesn't highlight the button - default behaviour)
  const finalFocusRef = useRef(null)

  /*
   * Handling to trigger the opening and closing of the search from a keyboard short cut.
   */
  useEffect(() => {
    const handleKeyDown: EventListener = (event) => {
      if ((event as unknown as KeyboardEvent).metaKey && (event as unknown as KeyboardEvent).key === "k") {
        if (!isOpen) onOpen();
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onOpen]);


  /*
   * Search state and results
   */
  const [searchVal, setSearchVal] = useState<string>("");
  const query = useDebounce(searchVal, 1000);
  const { error, loading, videos } = useYoutubeSearch(query, noOfResults);


  /** Clears the input if there is a value otherwise closes the modal. */
  const onClickXButton = useCallback(() => {
    if (!searchVal) return onClose();
    setSearchVal("");
  }, [onClose, searchVal]);


  const { playVideo, isSocketConnected } = usePlayer();

  /** Callback that plays the card youtube video. */
  const onClickCard = useCallback((video: Video) => {
    playVideo(video);
    onClose();
  }, [onClose, playVideo]);

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
          <SearchBarBox
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
            alignItems="center"
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
              isDisabled
            />
            <Tooltip label="Web socket status" openDelay={TooltipOpenDelay}>
              <span>
                <Icon
                  aria-label="Websocket connected"
                  as={HiChartBar}
                  color={isSocketConnected ? "green" : "orange"}
                />
              </span>
            </Tooltip>
            {/* <IconButton
              aria-label="Settings"
              colorScheme="purple"
              icon={<HiCog6Tooth />}
              variant="ghost"
              isDisabled
            /> */}
          </Flex>
        </Flex>
      </header>

      {/* Search and results */}
      <Modal
        finalFocusRef={finalFocusRef}
        isOpen={isOpen}
        scrollBehavior="inside"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow={0}>
          <Flex alignItems="center" flexDir="column">
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
                borderRadius="6px"
                boxShadow="md"
                height="40px"
                placeholder="Search"
                px="10px"
                value={searchVal}
                variant="unstyled"
                width="100%"
                autoFocus
                onChange={val => setSearchVal(val.target.value)}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Close search"
                  icon={<HiXMark />}
                  variant="link"
                  onClick={onClickXButton}
                />
              </InputRightElement>
            </InputGroup>
            {loading ?
              <Progress
                bgColor={searchBg}
                borderBottomLeftRadius="6px"
                borderBottomRightRadius="6px"
                colorScheme="purple"
                height="8px"
                mt="-8px"
                width="100%"
                zIndex={10}
                isIndeterminate
              /> :
              <Box
                bgColor={searchBg}
                borderBottomLeftRadius="6px"
                borderBottomRightRadius="6px"
                height="8px"
                mt="-8px"
                width="100%"
                zIndex={10}
              />
            }
          </Flex>

          {videos.length > 0 || error ?
            <ModalBody
              bg={modalBg}
              mt="10px"
            >
              <VStack>
                {error ? <Text mb="4px">{error}</Text> : <Text mb="4px">{`Showing the first ${noOfResults} Youtube video results`}</Text>}
                {videos.map(video => {
                  if (!video) return;
                  return <VideoCard key={video.videoId} playVideo={onClickCard} video={video} />;
                })}
              </VStack>
            </ModalBody> :
            null
          }
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


/**
 * Renders a input like styled box.
 * 
 * @param onOpen Callback for when the box is clicked. 
 * @returns {JSX.Element} The search bar box.
 */
const SearchBarBox: FC<BoxProps & { onOpen: () => void }> = ({ onOpen, ...props }) => {
  const bg = useColorModeValue("white", "neutral.700");

  return (
    <Box
      as="button"
      bg={bg}
      borderRadius={8}
      boxShadow="base"
      height="40px"
      px="10px"
      onClick={onOpen}
      {...props}
    >
      <HStack gap={4}>
        <Icon aria-label="search icon" as={HiMagnifyingGlass} />
        <Text opacity={0.7}>Search</Text>
        <Spacer />
        <HStack gap={1}>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </HStack>
      </HStack>
    </Box>
  )
}