import { useEffect, useState } from "react";
import { YoutubeAPI } from "./api";
import { AxiosResponse } from "axios";


/**
 * Custom hooks that returns a list of videos that match the search query.
 * @param query The search query.
 * @param maxResults Total number of results returned per page. Default `20`,
 * @returns 
 */
export const useYoutubeSearch = (query: string, maxResults?: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Prevent empty string searches
    if (!query) return;

    /*
     * Get list of videos and their content details.
     */
    setLoading(true);
    YoutubeAPI.searchVideos(query, maxResults)
      .then((searchRes: AxiosResponse<SearchVideoItem[]>) => {
        const videoIds = searchRes.data.map(i => {
          return i.id.videoId
        })
        YoutubeAPI.getVideosContentDetails(videoIds)
          .then((detailsRes: AxiosResponse<GetVideosContentDetailsItem[]>) => {
            if (isMounted) {
              const combinedResults: YoutubeVideo[] = detailsRes.data.map(detailsItem => {
                const video = searchRes.data.find(searchItem => searchItem.id.videoId == detailsItem.id);
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
