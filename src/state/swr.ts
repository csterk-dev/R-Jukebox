import useSWRInfinite, { SWRInfiniteKeyedMutator, SWRInfiniteResponse } from "swr/infinite";
import { GetHistoryQueryParams, GetSearchQueryParams, HistoryAPI, HistorySortTypes, YoutubeAPI } from "../utils/api";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { getDebuggingStateFromStorage } from "../utils/misc";

const DEFAULT_HISTORY_PAGE_SIZE = 20;
const DEFAULT_SEARCH_PAGE_SIZE = 10;
const showDevDebugging = getDebuggingStateFromStorage();


interface _UseListHistoryInfiniteResult {
  /** Array of arrays (each inner array is a page). */
  data: HistoryVideo[][] | undefined;
  /** Indicates that SWR is loading */
  isLoading: boolean;
  /** Any errors. */
  error: any;
  /** Indicates that SWR is re-evaluating. */
  isValidating: boolean;
  /** Mutator function. */
  mutate: SWRInfiniteKeyedMutator<HistoryVideo[][]>;
  /** Current number of pages fetched. */
  size: number;
  /** Function to set the number of pages. */
  setSize: (size: number | ((_size: number) => number)) => Promise<HistoryVideo[][] | undefined>;
  /** Number of results per page. */
  step: number;
  /** Function to set the of results. */
  setStep: Dispatch<SetStateAction<number>>;
}


/**
 * Custom SWR hook to fetch and manage history items with infinite scrolling, sorting, and searching.
 * 
 * @param params - Base query parameters (searchTerm, sort). Page and step will be managed internally.
 * @returns An object containing history data pages, loading state, error state, pagination controls.
 * 
 * @deprecated Kept for reference.
 */
export function _usePaginatedListHistory(baseParams?: Omit<GetHistoryQueryParams, "page">): _UseListHistoryInfiniteResult {
  const [step, setStep] = useState(DEFAULT_HISTORY_PAGE_SIZE);


  const getKey = (pageIndex: number, previousPageData: HistoryVideo[]): ([string, GetHistoryQueryParams] | null) => {
    // If no previous page data and not the first page, we've reached the end
    if (previousPageData && !previousPageData.length && pageIndex > 0) return null;

    // Construct the URL key for SWR & baseParams for search/sort etc
    return [
      "history",
      {
        ...baseParams,
        step,
        page: pageIndex
      }
    ];
  };


  const res = useSWRInfinite<HistoryVideo[]>(
    getKey,
    async (keyParts) => {
      // The fetcher function receives the key parts (the array returned by getKey)
      const [, fetchParams] = keyParts;
      return await HistoryAPI.getHistory(fetchParams as GetHistoryQueryParams);
    },
    {
      // Optional SWR configurations
      // revalidateOnFocus: false, // Often disabled for infinite scroll to prevent jarring re-fetches
      // revalidateOnReconnect: false,
      // refreshInterval: 0,
    }
  );

  return {
    ...res,
    step,
    setStep
  }
}



export interface UsePaginatedHistoryReturn extends SWRInfiniteResponse<HistoryVideo[], any> {
  searchTerm: string | undefined;
  setSearchTerm: React.Dispatch<React.SetStateAction<string | undefined>>;
  sort: HistorySortTypes;
  setSort: React.Dispatch<React.SetStateAction<HistorySortTypes>>;
  hasMore: boolean;
  loadMore: () => void;
}



/**
 * A single, cohesive SWR hook that manages history data with infinite scrolling,
 * search, and sort functionality.
 *
 * This version consolidates all state and logic to ensure a stable SWR key,
 * preventing perpetual re-requests on network errors.
 *
 * @param initialSort The default sort order to use.
 * @returns An object containing the history data, loading states, and all related state setters and controls.
 */
export function usePaginatedHistory(initialSort: HistorySortTypes = "PLAYED_AT_DATE_DESCENDING"): UsePaginatedHistoryReturn {
  const [sort, setSort] = useState<HistorySortTypes>(initialSort);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const queryParams = useMemo(() => ({
    sort,
    searchTerm,
    step: DEFAULT_HISTORY_PAGE_SIZE
  }), [sort, searchTerm]);


  /**
   * Gets the query key used to calculate pagination
   */
  const getKey = useCallback((pageIndex: number, previousPageData: HistoryVideo[]): (GetHistoryQueryParams | null) => {
    // Stop fetching if the previous page was empty (end of results)    
    if (previousPageData && !previousPageData.length && pageIndex > 0) {
      return null;
    }    
    
    return {
      ...queryParams,
      page: pageIndex
    };
  }, [queryParams]);


  const res = useSWRInfinite<HistoryVideo[]>(
    getKey,
    async (fetchParams) => {
      showDevDebugging && console.info("usePaginatedHistory params:", fetchParams);
      return await HistoryAPI.getHistory(fetchParams as GetHistoryQueryParams);
    },
    {
      // Start by fetching the first page
      initialSize: 1,
      revalidateFirstPage: false
    }
  );

  const { data, setSize, isValidating } = res;

  const hasMore = useMemo(() => data ? (data[data.length - 1]?.length === DEFAULT_HISTORY_PAGE_SIZE) : true, [data]);


  const loadMore = useCallback(() => {
    if (!isValidating && hasMore) {
      setSize(prevSize => prevSize + 1);
    }
  }, [hasMore, isValidating, setSize]);


  return {
    ...res,
    searchTerm,
    setSearchTerm,
    sort,
    setSort,
    hasMore,
    loadMore
  };
}


export interface UsePaginatedYTSearchReturn extends SWRInfiniteResponse<SearchResultPage, any> {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  loadMore: () => void;
}


/**
 * A single, cohesive SWR hook that manages searching youtubes API with infinite scrolling.
 *
 * @returns An object containing the search data, loading states, and all related state setters and controls.
 */
export function usePaginatedYTSearch(): UsePaginatedYTSearchReturn {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState(DEFAULT_SEARCH_PAGE_SIZE);



  /**
   * Gets the query key used to calculate pagination
   */
  const getKey = useCallback((pageIndex: number, previousPageData: SearchResultPage | null): (GetSearchQueryParams | null) => {
    // Don't fetch if no search term is provided
    if (!searchTerm.length) {
      return null;
    }
    
    // Stop fetching if the previous page had no nextPageToken (end of results)
    if (previousPageData && !previousPageData.nextPageToken && pageIndex > 0) {
      return null;
    }

    // Construct query params directly to avoid dependency issues
    const baseQueryParams: GetSearchQueryParams = {
      q: searchTerm,
      type: "video",
      pageSize
    };

    // For the first page, don't include pageToken
    if (pageIndex === 0) {
      return baseQueryParams;
    }

    // For subsequent pages, use the nextPageToken from the previous page
    return {
      ...baseQueryParams,
      pageToken: previousPageData?.nextPageToken
    };
  }, [searchTerm, pageSize]);


  const res = useSWRInfinite<SearchResultPage>(
    getKey,
    async (fetchParams) => {
      showDevDebugging && console.info("usePaginatedYTSearch params:", fetchParams);
      const response = await YoutubeAPI.searchVideos(fetchParams as GetSearchQueryParams);
      return response.data;
    },
    {
      // Start by fetching the first page
      initialSize: 1
    }
  );

  const { data, setSize, isValidating } = res;

  const hasMore = useMemo(() => {
    if (!data || data.length === 0) return true;
    const lastPage = data[data.length - 1];
    return !!lastPage?.nextPageToken;
  }, [data]);


  const loadMore = useCallback(() => {
    if (!isValidating && hasMore) {
      setSize(prevSize => prevSize + 1);
    }
  }, [hasMore, isValidating, setSize]);


  return {
    ...res,
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    hasMore,
    loadMore
  };
}
