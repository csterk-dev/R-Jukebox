import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getGoogleAutoCompleteSuggestions, YoutubeAPI } from "./api";
import { AxiosResponse } from "axios";
import { socket as socketInstance } from "./socket";
import { SOCKET_EVENT_KEYS } from "../constants";

/**
 * Custom hooks that returns a momoized list of videos that match the search query.
 * @param query The search query.
 * @param maxResults Total number of results returned per page. Default `20`,
 * @returns {Object} A momized object containing the videos, error and loading states.
 */
const useYoutubeSearch = (query: string, maxResults?: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Prevent empty string searches
    if (!query) return;

    /*
     * Get list of videos and their content details.
     */
    setLoading(true);
    YoutubeAPI.searchVideos(query, maxResults)
      .then((results: AxiosResponse<Video[]>) => {
        if (isMounted) {
          setVideos(results.data);
        }
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query, maxResults]);


  return useMemo(() => (
    {
      error,
      loading,
      videos
    }
  ), [error, loading, videos])
};


/**
 * Returns a momoized list of suggestions that match the search query.
 * @note Only begins searching when the query length is greater than 4 chars
 * @param query The search query.
 * @param maxNumOfResults Only returns up to the provided number of results (if any).
 * @returns {Object} A momized object containing the suggestions, error and loading states.
 */
export const useGoogleSuggestions = (query: string, maxNumOfResults: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  useEffect(() => {
    let isMounted = true;

    // Prevent empty string searches
    if (!query || query.length < 5) return;

    /*
     * Get list of videos and their content details.
     */
    setLoading(true);
    getGoogleAutoCompleteSuggestions(query)
      .then((res: AxiosResponse) => {
        if (res.status !== 200) {
          throw new Error("Suggestion get request unsuccessful");
        }

        const suggestionRes: string[] = res.data[1].map((item: any[]) => item[0]);
        setSuggestions(suggestionRes.slice(0, maxNumOfResults));
      })
      .catch((err: any) => {
        setError(err.message);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [maxNumOfResults, query]);


  return useMemo(() => (
    {
      error,
      loading,
      suggestions,
      clearSuggestions
    }
  ), [clearSuggestions, error, loading, suggestions])
};

/**
 * Custom hooks that connects to the websocket server and provides monitoring and updating functionality.
 *
 * @returns {Object} A momized object containing the current connection state of the socket.
 */
export const useWebSockets = () => {
  const [isConnected, setIsConnected] = useState(socketInstance.connected);

  useEffect(() => {

    function onConnect() {
      // Tell the server that the client is ready to sync state
      setIsConnected(true);
      socketInstance.emit(SOCKET_EVENT_KEYS.getInitialState, socketInstance.id);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
    };
  }, []);

  return useMemo(() => (
    {
      isConnected,
      socketInstance
    }
  ), [isConnected]);
}


/*
 * THE BELOW IS THE LOCAL COPY OF UTIL FUNCTIONS FOR OFFLINE USE
 */

/**
 * Custom hook to debounce changes in a string.
 *
 * @param {string} text - The input string to be debounced.
 * @param {number} [delay] - The delay in milliseconds before updating the output. Default 300ms.
 * @returns {string} The debounced output string.
 * @example
 * ```tsx
 * // Input field debouncing
 * const [inputValue, setInputValue] = useState();
 * const inputText = useDebounce(inputValue, 400);
 * 
 * console.log(inputText) // This will only print every 400ms as the inputText is debounced.
 * 
 * ```
 */
export function useDebounce(text: string, delay: number = 300) {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOutput(text);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, text]);

  return output;
}


/** @returns Current width and height of the window */
function getWindowDimensions() {
  const { innerWidth: width = 0, innerHeight: height = 0 } = typeof window !== "undefined" ? window : {};
  return {
    width,
    height
  };
}

/**
 * Custom React Hook to track and provide the dimensions of the browser's window.
 *
 * @returns {{width: number, height: number}} An object containing the current width and height of the browser's window.
 * @example
 * ```tsx
 * const windowDimensions = useWindowDimensions();
 * 
 * // Resize the window to see the values change
 * useEffect(() => console.log(windowDimensions.height, windowDimensions.width), [windowDimensions]);
 * ```
 */
function useWindowDimensions() {
  // Set the initial window dimensions
  const [windowDimensions, setWindowDimensions] = useState<{ height: number; width: number; }>({
    height: 0,
    width: 0
  });



  // Attach event listener for window resize and clean up on component unmount
  useEffect(() => {
    // set this after initial render
    setWindowDimensions(getWindowDimensions());
    const handleResize = () => setWindowDimensions(getWindowDimensions());
    /** Function to update window dimensions when the window is resized. */
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Return the current window dimensions
  return windowDimensions;
}



/**
 * A custom hook that allows you to track whether an element is being hovered over or not, 
 * enabling you to apply conditional rendering or perform any desired actions based on the hover state.
 * 
 * @returns {[instance: HTMLDivElement, boolean]} An array containing a reference to attach to the target element and the current boolean hovering status.
 * @example
 * ```tsx
 * // Chakra UI Box & Text example:
 * const [boxRef, boxHovered] = useWebHover();
 * <Box
 *    bg="blue"
 *    h="50px"
 *    ref={boxRef}
 *    w="100%"
 *  >
 *    <Text color={boxHovered ? "red" : "black"}>
 *        Hover over the box to change my text color!
 *    </Text>
 * </Box>
 * ```
 */
export function useWebHover(): [(instance: HTMLDivElement) => void, boolean] {
  const [hovering, setHovering] = useState(false);
  const previousNode = useRef<HTMLDivElement>();

  const handleMouseEnter = useCallback(() => {
    setHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
  }, []);

  const customRef = useCallback(
    (node: HTMLDivElement) => {
      if (previousNode.current?.nodeType === Node.ELEMENT_NODE) {
        previousNode.current.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );
        previousNode.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }

      if (node?.nodeType === Node.ELEMENT_NODE) {
        node.addEventListener("mouseenter", handleMouseEnter);
        node.addEventListener("mouseleave", handleMouseLeave);
      }

      previousNode.current = node;
    },
    [handleMouseEnter, handleMouseLeave]
  );

  return [customRef, hovering];
}