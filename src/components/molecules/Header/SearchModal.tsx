import { Button, Flex, Icon, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalContent, ModalOverlay, ModalProps, Progress, Stack, Text, VStack } from "@chakra-ui/react";
import { FC, FormEvent, useCallback, useRef, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { VideoCard } from "components/atoms/VideoCard";
import { YoutubeAPI } from "utils/api";
import { AxiosResponse } from "axios";
import { NUM_OF_SEARCH_RESULTS } from "constants/index";
import { useDebounce, useGoogleSuggestions } from "utils/hooks";



type SearchModalProps = Omit<ModalProps, "children"> & {
  finalFocusRef: React.MutableRefObject<null>;
  isMobile: boolean;
  handlePlayVideo: (video: Video) => void;
  handleAddToBottomOfQueue: (video: Video) => void;
  handleAddToTopOfQueue: (video: Video) => void;
}

export const SearchModal: FC<SearchModalProps> = ({ finalFocusRef, isMobile, isOpen, handlePlayVideo, handleAddToBottomOfQueue, handleAddToTopOfQueue, onClose }) => {
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string>();

  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);


  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchInput = useDebounce(searchVal);
  const { suggestions, clearSuggestions } = useGoogleSuggestions(debouncedSearchInput);


  const hideSuggestions = useCallback(() => {
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(false)
  }, []);


  const handleSubmit = useCallback(async () => {
    if (!searchVal) return;
    hideSuggestions();
    try {
      setError(undefined);
      setLoading(true);

      const res: AxiosResponse<Video[]> = await YoutubeAPI.searchVideos(searchVal, NUM_OF_SEARCH_RESULTS);
      setVideos(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hideSuggestions, searchVal]);


  const onFormSubmit = useCallback((e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isMobile) inputRef.current?.blur();
    handleSubmit();
  }, [handleSubmit, isMobile]);


  const hideSuggestionsAndClose = useCallback(() => {
    onClose();
    hideSuggestions();
  }, [hideSuggestions, onClose]);


  const handleOverlayClick = useCallback(() => {
    if (showSuggestions) {
      hideSuggestions();
    } else hideSuggestionsAndClose();
  }, [hideSuggestions, hideSuggestionsAndClose, showSuggestions]);


  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (suggestions.length > 0 && showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) => prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0);
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (showSuggestions) {
          hideSuggestions();
        } else hideSuggestionsAndClose();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1);
      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        setSearchVal(suggestions[selectedSuggestionIndex]);
        handleSubmit();
      }
    }
  }, [suggestions, showSuggestions, selectedSuggestionIndex, hideSuggestionsAndClose, hideSuggestions, handleSubmit]);


  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchVal(suggestion);
    handleSubmit();
    hideSuggestions()
  }, [handleSubmit, hideSuggestions]);


  const onClickClear = useCallback(() => {
    if (searchVal) {
      setSearchVal("");
      inputRef.current?.focus();
      clearSuggestions();
      hideSuggestions();
    } else {
      hideSuggestionsAndClose();
    }
  }, [clearSuggestions, hideSuggestions, hideSuggestionsAndClose, searchVal]);



  return (
    <Modal
      closeOnOverlayClick={false}
      finalFocusRef={finalFocusRef}
      isOpen={isOpen}
      scrollBehavior="inside"
      size={isMobile ? "xs" : "md"}
      variant="search"
      onClose={() => void 0}
      onEsc={hideSuggestionsAndClose}
      onOverlayClick={handleOverlayClick}
    >
      <ModalOverlay />
      <ModalContent boxShadow={0}>
        <Flex
          alignItems="center"
          flexDir="column"
          position="relative"
        >
          <form
            id="search"
            style={{ width: "100%" }}
            onSubmit={useCallback((e: any) => onFormSubmit(e), [onFormSubmit])}
          >
            <InputGroup as="search">
              <InputLeftElement pointerEvents="none">
                <Icon aria-label="search icon" as={HiMagnifyingGlass} opacity={0.7} />
              </InputLeftElement>
              <Input
                _dark={{ bg: "neutral.700" }}
                bg="white"
                borderRadius="6px"
                boxShadow="md"
                className="searchInput"
                enterKeyHint="search"
                height="40px"
                id="searchInput"
                placeholder="Search Youtube"
                px="10px"
                ref={inputRef}
                type="text"
                value={searchVal}
                variant="unstyled"
                width="100%"
                autoFocus
                onChange={(val) => setSearchVal(val.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
              />
              <InputRightElement mr="10px">
                <Button
                  colorScheme="purple"
                  size="sm"
                  variant="link"
                  onClick={onClickClear}
                >
                  {searchVal ? "Clear" : "Close"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
          {loading ?
            <Progress
              _dark={{ bg: "neutral.700" }}
              bg="white"
              borderBottomLeftRadius="6px"
              borderBottomRightRadius="6px"
              colorScheme="brand"
              height="8px"
              mt="-8px"
              width="100%"
              zIndex={1}
              isIndeterminate
            /> :
            null
          }

          {showSuggestions && suggestions.length ? (
            <Stack
              _dark={{ bg: "neutral.700" }}
              bg="white"
              borderRadius="md"
              boxShadow="md"
              overflow="hidden"
              position="absolute"
              spacing={0}
              top="50px"
              width="100%"
              zIndex={10}
            >
              {suggestions.map((suggestion, index) => index < 10 && (
                <Text
                  key={suggestion}
                  _dark={{ bg: index === selectedSuggestionIndex ? "purple.700" : undefined }}
                  _hover={{
                    bg: "purple.50",
                    _dark: { bg: "purple.500" }
                  }}
                  bg={index === selectedSuggestionIndex ? "purple.100" : undefined}
                  cursor="pointer"
                  px="10px"
                  py="4px"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Text>
              ))}
            </Stack>
          ) : null}
        </Flex>

        {videos.length > 0 || error ?
          <ModalBody
            borderRadius={5}
            mt="10px"
            px="10px"
          >
            <VStack>
              {error ? <Text mb="4px">{error}</Text> : <Text mb="4px">{`Showing the first ${NUM_OF_SEARCH_RESULTS} Youtube video results`}</Text>}
              {videos.map(video => {
                if (!video) return;
                return (
                  <VideoCard
                    key={video.videoId}
                    addToBottomOfQueue={handleAddToBottomOfQueue}
                    addToTopOfQueue={handleAddToTopOfQueue}
                    isMobile={isMobile}
                    playVideo={handlePlayVideo}
                    video={video}
                  />
                );
              })}
            </VStack>
          </ModalBody> :
          null
        }
      </ModalContent>
    </Modal>
  );
};