import { Box, Button, Flex, Icon, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalContent, ModalOverlay, ModalProps, Progress, Spinner, Stack, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { VideoCard } from "components/atoms/VideoCard";
import { MAX_NUM_OF_SUGGESTIONS } from "constants/index";
import { useDebounce, useGoogleSuggestions } from "utils/hooks";
import { usePaginatedYTSearch } from "state/swr";
import { useAppState } from "state/appContext";



type SearchModalProps = Omit<ModalProps, "children"> & {
  finalFocusRef: React.MutableRefObject<null>;
  isMobile: boolean;
  handlePlayVideo: (video: Video) => void;
  handleAddToBottomOfQueue: (video: Video, action: "add" | "move") => void;
  handleAddToTopOfQueue: (video: Video, action: "add" | "move") => void;
}

export const SearchModal: FC<SearchModalProps> = ({ finalFocusRef, isMobile, isOpen, handlePlayVideo, handleAddToBottomOfQueue, handleAddToTopOfQueue, onClose }) => {
  const { showDevDebugging } = useAppState();
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    data,
    error,
    searchTerm,
    setSearchTerm,
    isLoading,
    isValidating,
    hasMore,
    loadMore
  } = usePaginatedYTSearch();


  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchInput = useDebounce(searchVal);
  const { suggestions, clearSuggestions } = useGoogleSuggestions(debouncedSearchInput, MAX_NUM_OF_SUGGESTIONS);

  // Track if we should show results (when there are actual results to display, or if an error is present (we still render the error in the modal body).
  const shouldShowResults = (!!data?.length && data.some(page => page.videos.length > 0));


  const hideSuggestions = useCallback(() => {
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(false)
  }, []);


  const handleSubmit = useCallback(() => {
    if (!searchVal) return;
    hideSuggestions();
    setSearchTerm(searchVal);
  }, [hideSuggestions, searchVal, setSearchTerm]);


  const onFormSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isMobile) inputRef.current?.blur();
    handleSubmit();
  }, [handleSubmit, isMobile]);


  const hideSuggestionsAndClose = useCallback(() => {
    onClose();
    hideSuggestions();
  }, [hideSuggestions, onClose]);



  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (suggestions.length > 0 && showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) => prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0);

      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1);

      } else if (e.key === "Escape") {
        e.preventDefault();
        if (showSuggestions) {
          hideSuggestions();
        } else hideSuggestionsAndClose();

      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        setSearchVal(suggestions[selectedSuggestionIndex]);
        handleSubmit();
      }
    }
  }, [suggestions, showSuggestions, selectedSuggestionIndex, hideSuggestionsAndClose, hideSuggestions, handleSubmit]);


  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchVal(suggestion);
    handleSubmit();
    hideSuggestions();
    if (isMobile) inputRef.current?.blur();
    else inputRef.current?.focus();
  }, [handleSubmit, hideSuggestions, isMobile]);


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


  /*
   * Manually handle the closing of the modal to allow for auto show/hiding of the suggestions
   */
  useEffect(() => {
    const handler = (event: Event) => {
      const clickedElement = event.target as HTMLElement | null;

      // WHen modal overlay is pressed, hide suggestions if showing otherwise close modal
      if (clickedElement?.outerHTML.includes("chakra-modal__content-container")) {
        if (searchVal && showSuggestions && suggestions.length) hideSuggestions();
        else onClose();
      }

      // Additionally hide suggestions if the list is clicked
      if (clickedElement?.outerHTML.includes("search_modal_body")) {
        if (searchVal && showSuggestions && suggestions.length) hideSuggestions();
      }
    };

    // Mouse up fires on 'touchend' events so not required to attach a 'touchend' listener
    window.addEventListener("mouseup", handler);
    return () => {
      window.removeEventListener("mouseup", handler);
    };

  }, [hideSuggestions, onClose, searchVal, showSuggestions, suggestions.length]);


  /*
   * Close suggestions when the user scrolls the video results 
   */
  const modalBodyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = modalBodyRef.current;

    // We need to ensure that the modal body div is mounted in the dom as we conditionally show hide the element if not search results.
    if (container) {
      const handleScroll = () => {
        if (searchVal && showSuggestions && suggestions.length) hideSuggestions();
      };

      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }

  }, [hideSuggestions, searchVal, showSuggestions, suggestions.length]);


  const flattened = useMemo(() => !data ? [] : data?.flatMap(page => page.videos), [data]);

  const searchResultVideos = useMemo(() => {
    return flattened.map((video, index) => {
      const cardKey = `${video.videoId}-${index}`;
      if (!video) return;
      return (
        <VideoCard
          key={cardKey}
          addToBottomOfQueue={() => handleAddToBottomOfQueue(video, "add")}
          addToTopOfQueue={() => handleAddToTopOfQueue(video, "add")}
          as="li"
          isMobile={isMobile}
          playVideo={handlePlayVideo}
          video={video}
        />
      );
    })
  }, [flattened, handleAddToBottomOfQueue, handleAddToTopOfQueue, handlePlayVideo, isMobile]);


  // Handle infinite scroll loading when user scrolls to bottom
  useEffect(() => {
    const handleScroll = () => {
      const container = modalBodyRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const threshold = 5;

      const isNearBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= threshold;

      // If near bottom, not currently loading/validating, and there might be more data
      if (isNearBottom && !isValidating && !error && hasMore) {
        showDevDebugging && console.info("SearchModal: loading more items triggered from local scroll.");
        loadMore();
      }
    };

    const container = modalBodyRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isValidating, hasMore, loadMore, error, showDevDebugging]);


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
            onSubmit={useCallback((e: FormEvent<HTMLFormElement>) => onFormSubmit(e), [onFormSubmit])}
          >
            <InputGroup
              as="search"
              bg="surface.foreground"
              borderRadius="lg"
              overflow="hidden"
            >
              <InputLeftElement pointerEvents="none">
                <Icon aria-label="search icon" as={HiMagnifyingGlass} opacity={0.7} />
              </InputLeftElement>
              <Input
                className="searchInput"
                enterKeyHint="search"
                height="40px"
                id="searchInput"
                placeholder="Search Youtube"
                ref={inputRef}
                type="text"
                value={searchVal}
                variant="unstyled"
                width="100%"
                autoFocus
                onChange={useCallback((val: ChangeEvent<HTMLInputElement>) => {
                  setSearchVal(val?.target.value);
                  setShowSuggestions(true);
                }, [])}
                onClick={useCallback(() => setShowSuggestions(true), [])}
                onKeyDown={handleKeyDown}
              />
              <InputRightElement bg="surface.foreground" px={3} w="auto">
                <Button
                  colorScheme="brand"
                  size="sm"
                  variant="link"
                  onClick={onClickClear}
                >
                  {searchVal ? "Clear" : "Close"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
          {isLoading ?
            <Progress
              bg="surface.foreground"
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

          {searchVal && showSuggestions && suggestions.length ? (
            <Stack
              bg="surface.foreground"
              borderRadius="lg"
              boxShadow="lg"
              overflow="hidden"
              position="absolute"
              spacing={0}
              top="50px"
              width="100%"
              zIndex={10}
            >
              {suggestions.map((suggestion, index) => (
                <Text
                  key={suggestion}
                  _dark={{ bg: index === selectedSuggestionIndex ? "brand.700" : undefined }}
                  _hover={{
                    bg: index === selectedSuggestionIndex ? "brand.100" : "brand.200",
                    _dark: { bg: index === selectedSuggestionIndex ? "brand.700" : "brand.500" }
                  }}
                  bg={index === selectedSuggestionIndex ? "brand.100" : undefined}
                  cursor="pointer"
                  px={2}
                  py={1}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Text>
              ))}
            </Stack>
          ) : null}
        </Flex>

        {shouldShowResults || !!error ?
          <ModalBody
            borderRadius="lg"
            id="search_modal_body"
            layerStyle="themed-scroll"
            overflowY="auto"
            ref={modalBodyRef}
          >
            <Box
              bg="surface.foreground"
              pb={3}
              position="sticky"
              pt={2}
              top={0}
              w="100%"
              zIndex="docked"
            >
              {!!error ?
                <Text
                  color="text.error"
                  textAlign="center"
                  textStyle="body/sub-text"
                >
                  An error occured while searching
                </Text> :
                <Text textStyle="body/sub-text">
                  {`Showing ${flattened.length} results for `}
                  <span style={{ fontWeight: "bold" }}>{`'${searchTerm}'`}</span>
                </Text>
              }
            </Box>

            {searchResultVideos.length ?
              <Stack as="ul">
                {searchResultVideos}
              </Stack> :
              null
            }

            {isValidating ?
              <Box mx="auto" pt={2}>
                <Spinner size="sm" />
              </Box> :
              !hasMore && flattened.length > 0 ?
                <Text color="text.subtle" pt={2} textAlign="center">
                  No more videos to display
                </Text> :
                null
            }
          </ModalBody> :
          null
        }
      </ModalContent>
    </Modal>
  );
};