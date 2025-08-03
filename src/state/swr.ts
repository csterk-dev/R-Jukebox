import useSWRInfinite, { SWRInfiniteKeyedMutator, SWRInfiniteResponse } from "swr/infinite";
import { GetHistoryQueryParams, HistoryAPI, HistorySortTypes } from "../utils/api";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";



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
  const [step, setStep] = useState(25);


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


/**
 * Fetches a single page of History Videos.
 * 
 * @param query Any query params to pass to the API.
 * @returns An returned History data.
 */
export function useFetchHistoryPaginated(query?: GetHistoryQueryParams): SWRInfiniteResponse<HistoryVideo[], any> {

  /**
   * Gets the query key used to calculate pagination
   */
  const getKey = (pageIndex: number, previousPageData: HistoryVideo[] | null, currentQuery: GetHistoryQueryParams | undefined) => {

    // If no currentQuery or we've reached the end based on previous data
    if (!currentQuery || (previousPageData && previousPageData.length === 0 && pageIndex > 0)) {
      return null;
    }

    return [
      "history",
      {
        ...currentQuery,
        page: pageIndex
      }
    ];
  };


  const res = useSWRInfinite<HistoryVideo[]>(
    (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, query),
    async (keyParts) => {
      const [, fetchParams] = keyParts;
      return await HistoryAPI.getHistory(fetchParams as GetHistoryQueryParams);
    },
    {
      // Optional SWR configurations
      // revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      // refreshInterval: 0,
    }
  );

  return res;
}


/** 
 * Additional properties and setters that will be injected into the SWR response object by the HOC. 
 */
export interface AdditionalListFilterEntries<SortTypes extends string> {
  /** Current search term, if any. */
  searchTerm: string | null;
  /** Current filter option, if any. */
  filter: string | null;
  /** Current sort, if any. */
  sort: SortTypes;
  /** Set the filter option. */
  setFilter: Dispatch<SetStateAction<string | null>>;
  /**
   * For useSWRInfinite, setPage directly maps to setSize.
   * So we will simulate a 'setPage' that changes 'size'.
   * Represents the current SWRInfinite 'size' (number of pages fetched)
   */
  setPage: Dispatch<SetStateAction<number>>;
  /** Set the search term. */
  setSearchTerm: Dispatch<SetStateAction<string | null>>;
  /** Set the sort. */
  setSort: Dispatch<SetStateAction<SortTypes>>;
  /** Indicates whether there are more results to load. */
  hasMore: boolean;
  /** Callback that increments the size (page) to load more */
  loadMore(): void;
}


const DEFAULT_SWR_PAGE_SIZE = 20;


type ListQueryRecord<SortTypes extends string> =
  & {
    page?: number;
    searchTerm?: string;
    filter?: string;
    sort?: SortTypes;
    step: number;
  };


/**
 * A HOF (Higher order function) that adds list specific functionality such as sorting or filtering to the provided useSWRInfinite hook.
 * 
 * @param useSWRCustomHook The higher-order function that wraps a custom SWRInfinite hook
 * @param defaultSort The initial sort type passed to the first call of the useSwr hook.
 * @returns The returned response from the provided useSWR hook, along with the additonal list filters (e.g. sort, filter, & search term).
 * 
 * @note Not all additional list filters may be used by the provided useSWR hook.
 */
export function withInfiniteListFilters<SortTypes extends string, Query extends ListQueryRecord<SortTypes>, Data>(useSWRCustomHook: (query?: Query) => SWRInfiniteResponse<Data[], any>, defaultSort: SortTypes) {
  return ((initialQuery?: ListQueryRecord<SortTypes>) => {

    const [sort, setSort] = useState<SortTypes>(defaultSort);
    const [searchTerm, setSearchTerm] = useState<string | undefined>(initialQuery?.searchTerm);
    const [filter, setFilter] = useState<string | undefined>(initialQuery?.filter);

    // Call the wrapped SWRInfinite hook
    // We pass the merged query including filters and the current page size (size from SWRInfinite, acting as page count)
    const res = useSWRCustomHook({
      ...initialQuery,
      sort,
      searchTerm,
      filter,
      step: DEFAULT_SWR_PAGE_SIZE
    } as Query);


    const { data, setSize, isValidating } = res;
    const hasMore = useMemo(() => data ? (data[data.length - 1]?.length === DEFAULT_SWR_PAGE_SIZE) : true, [data]);


    const loadMore = useCallback(() => {
      if (!isValidating && hasMore) {
        setSize(prevSize => prevSize + 1);
      }
    }, [hasMore, isValidating, setSize]);


    // Update the properties of the 'res' object with our HOC filters.
    Object.assign(res, {
      searchTerm,
      filter,
      sort,
      setFilter,
      setPage: setSize,
      setSearchTerm,
      setSort,
      hasMore,
      loadMore
    });

    // Cast the returned 'res' object to the correct combined type
    return res as ReturnType<typeof useSWRCustomHook> & AdditionalListFilterEntries<SortTypes>;

    // Only allow initial static query params
    // as (initialQuery?: Omit<Query, keyof ListQueryRecord<SortTypes>>) => ReturnType<typeof useSWRCustomHook> & AdditionalListFilterEntries<SortTypes>;
  })
}



interface HistoryQuery extends GetHistoryQueryParams {
  // Can add any history-specific query fields here if needed beyond generic ListQueryRecord
}


/**
 * A specialized SWR hook for fetching paginated history items with filters.
 * It's built by wrapping `useFetchHistoryPaginated` with `withInfiniteListFilters`.
 *
 * @param initialQuery - Optional initial query parameters (e.g., a default searchTerm).
 * @returns An object containing history data (paginated), loading states,
 * and methods for controlling search, sort, and pagination.
 */
export const usePaginatedListHistory = withInfiniteListFilters<HistorySortTypes, HistoryQuery, HistoryVideo>(
  useFetchHistoryPaginated,
  "PLAYED_AT_DATE_DESCENDING"
);