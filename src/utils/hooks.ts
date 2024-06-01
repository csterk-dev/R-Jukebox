import { useEffect, useMemo, useState } from "react";
import { YoutubeAPI } from "./api";
import { AxiosResponse } from "axios";
import { SOCKET_EVENT_KEYS, SOCKET_URL } from "../constants";
import { io } from "socket.io-client";


/**
 * Custom hooks that returns a momoized list of videos that match the search query.
 * @param query The search query.
 * @param maxResults Total number of results returned per page. Default `20`,
 * @returns {Object} A momized object containing the videos, error and loading states.
 */
export const useYoutubeSearch = (query: string, maxResults?: number) => {
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
 * Custom hooks that connects to the websocket server and provides monitoring and updating functionality.
 *
 * @returns {Object} A momized object containing the current connection state of the socket.
 */
export const useWebSockets = () => {
  const [isConnected, setIsConnected] = useState(false);

  const socket = io(SOCKET_URL);

  useEffect(() => {

    function onConnect() {
      // Tell the server that the client is ready to sync state
      setIsConnected(true);
      socket.emit(SOCKET_EVENT_KEYS.getInitialState, socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return useMemo(() => (
    {
      isConnected,
      socket
    }
  ), [isConnected, socket]);
}