import { Box, BoxProps, Divider, Flex, FlexProps, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Kbd, Modal, ModalBody, ModalContent, ModalOverlay, Progress, Spacer, Text, Tooltip, useColorModeValue, useDisclosure, useMediaQuery, VStack } from "@chakra-ui/react";
import { FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { HiChartBar, HiCog6Tooth, HiMagnifyingGlass, HiSpeakerWave, HiXMark } from "react-icons/hi2";
import { ColorModeSwitcher } from "../atoms/ColorModeSwitcher";
import { VideoCard } from "components/atoms/VideoCard";
import { VideoControls } from "components/atoms/VideoControls";
import { useDebounce } from "@usesoftwareau/react-utils";
import { useYoutubeSearch } from "utils/hooks";
import { usePlayer } from "state/playerContext";
import { MOBILE_BREAKPOINT } from "../../constants";


const noOfResults = 40;


const _PageHeader: FC<FlexProps> = (props) => {
  const headerBg = useColorModeValue("white", "neutral.900");
  const foreground = useColorModeValue("white", "neutral.700");
  const modalBg = useColorModeValue("neutral.offWhite", "neutral.700");
  const [isMobile] = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  // Search bar and results disclosure
  const { isOpen: isSearchOpen, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();

  /** Used to clear the focus when the modal closes (so it doesn't highlight the button - default behaviour) */
  const finalFocusRef = useRef(null)

  /*
   * Handling to trigger the opening and closing of the search from a keyboard short cut.
   */
  useEffect(() => {
    const handleKeyDown: EventListener = (event) => {
      if ((event as unknown as KeyboardEvent).metaKey && (event as unknown as KeyboardEvent).key === "k") {
        if (!isSearchOpen) onOpenSearch();
        else onCloseSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, onCloseSearch, onOpenSearch]);


  /*
   * Search state and results
   */
  const [searchVal, setSearchVal] = useState<string>("");
  const query = useDebounce(searchVal, 1000);
  const { error, loading, videos } = useYoutubeSearch(query, noOfResults);


  /** Clears the input if there is a value otherwise closes the modal. */
  const onClickXButton = useCallback(() => {
    if (!searchVal) return onCloseSearch();
    setSearchVal("");
  }, [onCloseSearch, searchVal]);


  const { playVideo, isSocketConnected } = usePlayer();

  /** Callback that plays the card youtube video. */
  const onClickCard = useCallback((video: Video) => {
    playVideo(video);
    onCloseSearch();
  }, [onCloseSearch, playVideo]);

  return (
    <>
      <header>
        <Flex
          alignItems="center"
          background={headerBg}
          boxShadow="base"
          gap="5px"
          justify="center"
          px={isMobile ? "20px" : "5px"}
          width="100%"
          {...props}
        >
          {isMobile ?
            <>
              <SearchBarBox
                flex={1}
                isMobile={isMobile}
                onOpen={onOpenSearch}
              />
              <VideoControls flex={1} />
              <IconButton
                aria-label="Open settings"
                bgColor={foreground}
                icon={<HiCog6Tooth />}
                onClick={onOpenSettings}
              />
            </> :

            <>
              <VideoControls flex={1} />
              <SearchBarBox
                flex={1}
                isMobile={isMobile}
                onOpen={onOpenSearch}
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
                <Tooltip label={isSocketConnected ? "Websocket connected" : "Websocket disconnected"}>
                  <span>
                    <Icon
                      aria-label="Websocket connected"
                      as={HiChartBar}
                      color={isSocketConnected ? "green" : "orange"}
                      ml="10px"
                      mt="5px"
                    />
                  </span>
                </Tooltip>
              </Flex>
            </>
          }
        </Flex>
      </header>

      {/* Settings (Mobile use ONLY) */}
      <Modal
        finalFocusRef={finalFocusRef}
        isOpen={isSettingsOpen}
        scrollBehavior="inside"
        size="xs"
        onClose={onCloseSettings}
      >
        <ModalOverlay />
        <ModalContent bg={foreground} boxShadow={0}>
          <Flex 
            alignItems="center" 
            justifyContent="space-between" 
            mt="10px"
            width="100%"
          >
            <Text fontWeight="600" pl="20px" textTransform="uppercase">Settings</Text>
            <IconButton
              aria-label="Close settings"
              icon={<HiXMark />}
              mr="10px"
              variant="ghost"
              onClick={onCloseSettings}
            />
          </Flex>
          <VStack
            align="flex-start"
            fontSize="16px"
            gap="10px"
            px="20px"
            py="10px"
          >
            <Divider />
            <ColorModeSwitcher disableTooltip withText />
            <Divider />

            <HStack>
              <Icon
                aria-label="Adjust volume"
                as={HiSpeakerWave}
              />
              <Text>Adjust volume</Text>
            </HStack>
            <Divider />

            <HStack>
              <Icon
                aria-label={`Websocket ${isSocketConnected ? "connected" : "disconnected"}`}
                as={HiChartBar}
                color={isSocketConnected ? "green" : "orange"}
              />
              <Text>{`Websocket ${isSocketConnected ? "connected" : "disconnected"}`}</Text>
            </HStack>
          </VStack>
        </ModalContent>
      </Modal>


      {/* Search and results */}
      <Modal
        finalFocusRef={finalFocusRef}
        isOpen={isSearchOpen}
        scrollBehavior="inside"
        size={isMobile ? "xs" : "md"}
        onClose={onCloseSearch}
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
                bg={foreground}
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
                  borderRadius="6px"
                  height="100%"
                  icon={<HiXMark />}
                  variant="link"
                  zIndex={10}
                  onClick={onClickXButton}
                />
              </InputRightElement>
            </InputGroup>
            {loading ?
              <Progress
                bgColor={foreground}
                borderBottomLeftRadius="6px"
                borderBottomRightRadius="6px"
                colorScheme="purple"
                height="8px"
                mt="-8px"
                width="100%"
                zIndex={1}
                isIndeterminate
              /> :
              null
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


type SearchBarBoxProps = BoxProps & {
  isMobile: boolean;
  onOpen: () => void
}

/**
 * Renders a input like styled box.
 * 
 * @param onOpen Callback for when the box is clicked. 
 * @returns {JSX.Element} The search bar box.
 */
const SearchBarBox: FC<SearchBarBoxProps> = ({ isMobile, onOpen, ...props }) => {
  const bg = useColorModeValue("white", "neutral.700");


  if (isMobile) return (
    <IconButton
      aria-label="Open search"
      bg={bg}
      icon={<HiMagnifyingGlass />}
      onClick={onOpen}
    />
  )
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
        <Icon aria-label="Open search" as={HiMagnifyingGlass} />
        <Text opacity={0.7}>Search</Text>
        <Spacer />
        <HStack gap={1} userSelect="none">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </HStack>
      </HStack>
    </Box>
  );
}