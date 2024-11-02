import { Button, Flex, Icon, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalContent, ModalOverlay, ModalProps, Progress, Text, VStack } from "@chakra-ui/react";
import { FC, FormEvent, useCallback, useRef, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { VideoCard } from "components/atoms/VideoCard";
import { YoutubeAPI } from "utils/api";
import { AxiosResponse } from "axios";
import { NUM_OF_SEARCH_RESULTS } from "constants/index";



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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!searchVal) return;
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
  }, [searchVal]);


  const onFormSubmit = useCallback((e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isMobile) inputRef.current?.blur();
    handleSubmit();
  }, [handleSubmit, isMobile]);


  /** Clears the input if there is a value. */
  const onClickClear = useCallback(() => {
    if (searchVal) setSearchVal("");
    else onClose();
  }, [onClose, searchVal]);


  return (
    <Modal
      finalFocusRef={finalFocusRef}
      isOpen={isOpen}
      scrollBehavior="inside"
      size={isMobile ? "xs" : "md"}
      variant="search"
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent boxShadow={0}>
        <Flex alignItems="center" flexDir="column">
          <form id="search" style={{ width: "100%" }} onSubmit={useCallback((e: any) => onFormSubmit(e), [onFormSubmit])}>
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
                type="search"
                value={searchVal}
                variant="unstyled"
                width="100%"
                autoFocus
                onChange={val => setSearchVal(val.target.value)}
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