import { Box, Button, Dialog, Flex, Icon, Input, InputGroup, Progress, Separator, Spinner, Stack, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiArrowUpRight, HiMagnifyingGlass } from "react-icons/hi2";
import { VideoCard } from "@atoms";
import { MAX_NUM_OF_SUGGESTIONS } from "@constants";
import { useDebounce, useGoogleSuggestions } from "@utils";
import { useAppState, usePaginatedYTSearch } from "@state";



type SearchModalProps = {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  handlePlayVideo: (video: Video) => void;
  handleAddToBottomOfQueue: (video: Video, action: "add" | "move") => void;
  handleAddToTopOfQueue: (video: Video, action: "add" | "move") => void;
}

export const SearchModal: FC<SearchModalProps> = ({ isMobile, isOpen, handlePlayVideo, handleAddToBottomOfQueue, handleAddToTopOfQueue, onClose }) => {
  const { showDevDebugging } = useAppState();
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

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

  const onClickOverlay = useCallback(() => {
    if (showSuggestions) return;
    onClose();
  }, [onClose, showSuggestions]);

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
        setSelectedSuggestionIndex((prevIndex) => prevIndex === suggestions.length - 1 ? -1 : prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0);

      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) => prevIndex === 0 ? -1 : prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1);

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


  const dialogBody = useMemo(() => {
    if (shouldShowResults || !!error) {
      const flattened = !data ? [] : data?.flatMap(page => page.videos);
      const searchResultVideos = flattened.map((video, index) => {
        const cardKey = `${video.videoId}-${index}`;
        return (
          <>
            <Separator />
            <VideoCard
              key={cardKey}
              addToBottomOfQueue={() => handleAddToBottomOfQueue(video, "add")}
              addToTopOfQueue={() => handleAddToTopOfQueue(video, "add")}
              as="li"
              isMobile={isMobile}
              playVideo={handlePlayVideo}
              video={video}
            />
          </>
        );
      });

      return (
        <Dialog.Body
          borderRadius="lg"
          id="search_modal_body"
          layerStyle="themed-scroll"
          maxH="740px"
          overflowY="auto"
          ref={modalBodyRef}
        >
          <Box
            bg="surface.foreground"
            mb={2}
            position="sticky"
            py={2}
            top={0}
            w="100%"
            zIndex="docked"
          >
            {!!error ?
              <Text color="fg.error" textAlign="center" textStyle="body/sub-text">
                An error occured while searching
              </Text> :
              <Text textStyle="body/sub-text">
                {`Showing ${flattened.length} results for `}
                <span style={{ fontWeight: "bold" }}>{`'${searchTerm}'`}</span>
              </Text>
            }
          </Box>

          {searchResultVideos.length ?
            <Stack as="ul" pb={2}>
              {searchResultVideos}
            </Stack> :
            null
          }

          {isValidating ?
            <Box mx="auto" pb={2}>
              <Spinner size="sm" />
            </Box> :
            !hasMore && flattened.length > 0 ?
              <Text color="fg.muted" pb={2} textAlign="center">
                No more videos to display
              </Text> :
              null
          }
        </Dialog.Body>
      )
    }
  }, [data, error, handleAddToBottomOfQueue, handleAddToTopOfQueue, handlePlayVideo, hasMore, isMobile, isValidating, searchTerm, shouldShowResults]);



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
    <Dialog.Root
      closeOnInteractOutside={false}
      open={isOpen}
      scrollBehavior="inside"
      size={isMobile ? "xs" : "md"}
      variant="search"
      onEscapeKeyDown={hideSuggestionsAndClose}
      onInteractOutside={onClickOverlay}
      // Decouple the internal on change handler as we handle closing manually.
      onOpenChange={() => void 0}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content boxShadow="none">
          <form
            id="search"
            style={{ width: "100%" }}
            onSubmit={useCallback((e: FormEvent<HTMLFormElement>) => onFormSubmit(e), [onFormSubmit])}
          >
            <InputGroup
              as="search"
              bg="surface.foreground"
              borderRadius="lg"
              endElement={
                <Button
                  _hover={{
                    color: "fg.accent",
                    textDecoration: "underline"
                  }}
                  colorPalette="brand"
                  mr="-10px"
                  size="sm"
                  variant="plain"
                  onClick={onClickClear}
                >
                  {searchVal ? "Clear" : "Close"}
                </Button>
              }
              overflow="hidden"
              startElement={
                <Icon color="fg.muted">
                  <HiMagnifyingGlass />
                </Icon>
              }
            >
              <Input
                _placeholder={{ color: "fg.subtle" }}
                borderColor="transparent"
                className="searchInput"
                enterKeyHint="search"
                focusRingColor="transparent"
                height="40px"
                id="searchInput"
                placeholder="Search Youtube"
                ref={inputRef}
                type="text"
                value={searchVal}
                width="100%"
                autoFocus
                onBlur={useCallback(() => setInputFocused(false), [])}
                onChange={useCallback((val: ChangeEvent<HTMLInputElement>) => {
                  setSearchVal(val?.target.value);
                  setShowSuggestions(true);
                }, [])}
                onClick={useCallback(() => setShowSuggestions(true), [])}
                onFocus={useCallback(() => setInputFocused(true), [])}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
          </form>
          {isLoading ?
            <Progress.Root
              colorPalette="brand"
              height="8px"
              mt="-8px"
              value={null}
              width="100%"
              zIndex={1}
            >
              <Progress.Track
                bg="surface.foreground"
                borderBottomLeftRadius="6px"
                borderBottomRightRadius="6px"
                boxShadow="none"
              >
                <Progress.Range />
              </Progress.Track>
            </Progress.Root> :
            null
          }

          {searchVal && showSuggestions && suggestions.length ? (
            <Stack
              bg="surface.foreground"
              borderRadius="lg"
              boxShadow="lg"
              gap={0}
              h={isMobile && inputFocused ? "220px" : undefined}
              overflow="hidden"
              overflowY="auto"
              position="absolute"
              top="50px"
              width="100%"
              zIndex="dropdown"
            >
              <Stack gap={0} role="listbox">
                {suggestions.map((suggestion, index) => {
                  const isSelected = index === selectedSuggestionIndex;
                  return (
                    <Flex
                      key={suggestion}
                      aria-selected={isSelected}
                      className="group"
                      css={{
                        // Base styles: selected state background
                        bg: "transparent",
                        "&[aria-selected='true']": {
                          bg: "primary.100"
                        },
                        // Hover styles for non-selected items
                        "&:hover": {
                          bg: "primary.200"
                        },
                        // Hover styles for selected items
                        "&[aria-selected='true']:hover": {
                          bg: "primary.100"
                        },
                        _dark: {
                          // Dark mode: selected state background
                          "&[aria-selected='true']": {
                            bg: "primary.700"
                          },
                          // Dark mode: hover styles for non-selected items
                          "&:hover": {
                            bg: "primary.500"
                          },
                          // Dark mode: hover styles for selected items
                          "&[aria-selected='true']:hover": {
                            bg: "primary.700"
                          }
                        }
                      }}
                      cursor="pointer"
                      px={2}
                      py={1.5}
                      role="option"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Text>
                        {suggestion}
                      </Text>
                      <Icon
                        _groupHover={{ display: "block" }}
                        as={HiArrowUpRight}
                        display={isSelected ? "block" : "none"}
                        ml="auto"
                        mt="3px"
                      />
                    </Flex>
                  )
                })}
              </Stack>
            </Stack>
          ) : null}

          {dialogBody}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
