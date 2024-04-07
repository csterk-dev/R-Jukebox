import { useEffect, useState } from "react";
import { YoutubeAPI } from "./api";
import { AxiosResponse } from "axios";


/*
 * 6 hours in milliseconds
 * const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000;
 */


/**
 * Custom hooks that returns a list of videos that match the search query.
 * @param query The search query.
 * @param maxResults Total number of results returned per page. Default `20`,
 * @returns 
 */
export const useYoutubeSearch = (query: string, maxResults?: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Prevent empty string searches
    if (!query) return;

    /*
     * TODO
     * Implement backend caching to sql lite instance:
     * - Hash the search query -> use as PK
     *    - Store search results and timestamp of when it was searched
     */

    /*
     * Get list of videos and their content details.
     */
    setLoading(true);
    YoutubeAPI.searchVideos(query, maxResults)
      .then((searchRes: AxiosResponse<SearchVideoResult>) => {
        const videoIds = searchRes.data.items.map(i => {
          return i.id.videoId
        })
        YoutubeAPI.getVideosContentDetails(videoIds)
          .then((detailsRes: AxiosResponse<GetVideosContentDetailsResult>) => {
            if (isMounted) {
              const combinedResults: YoutubeVideo[] = detailsRes.data.items.map(detailsItem => {
                const video = searchRes.data.items.find(searchItem => searchItem.id.videoId == detailsItem.id);
                if (!video) return;
                return {
                  video,
                  contentDetails: detailsItem.contentDetails
                }
              })
              setVideos(combinedResults);
            }
          })
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

  return {
    loading,
    error,
    videos
  };
};
