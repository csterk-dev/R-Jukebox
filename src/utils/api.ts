import axios from "axios";
import { jsonpAdapter } from "@pingtou/axios-jsonp";
import { SERVER_URL } from "../constants";

const HISTORY_API_URL = `${SERVER_URL}/history`;
const YOUTUBE_API_URL = `${SERVER_URL}/youtube`;

/** A YT undocumented API for auto suggest search queries */
const GOOGLE_AUTO_COMPLETE_URL = "https://clients1.google.com/complete/search";

export async function getGoogleAutoCompleteSuggestions(query: string) {

  return await axios({
    url: GOOGLE_AUTO_COMPLETE_URL,
    adapter: jsonpAdapter,
    params: {
      client: "youtube",
      hl: "en",
      ds: "yt",
      q: query
    }
  });
}


const YOUTUBE_CLIENT = axios.create({
  baseURL: YOUTUBE_API_URL,
  headers: {
    "content-type": "application/json"
  },
  responseType: "json"
});

const HISTORY_CLIENT = axios.create({
  baseURL: HISTORY_API_URL,
  headers: {
    "content-type": "application/json"
  },
  responseType: "json"
});


export type GetSearchQueryParams = {
  q: string;
  type: "video";
  regionCode?: string;
  pageSize?: number;
  pageToken?: string;
};


export const YoutubeAPI = {
  /**
   * Returns a list of video snippets that match the search query. 
   * 
   * @param query The search query.
   * @param limit Total number of results returned per page. Default `20`,
   * 
   * @remarks Quota cost = `100 credits`.
   */
  async searchVideos(params: GetSearchQueryParams) {
    return await YOUTUBE_CLIENT.get<SearchResultPage>("/search", { params });
  }
}

export type HistorySortTypes = "PLAYED_AT_DATE_ASCENDING" | "PLAYED_AT_DATE_DESCENDING";
export interface GetHistoryQueryParams {
  sort?: HistorySortTypes;
  page?: number;
  step: number;
  searchTerm?: string;
}

export const HistoryAPI = {
  async getHistory(params?: GetHistoryQueryParams): Promise<HistoryVideo[]> {
    try {
      const response = await HISTORY_CLIENT.get<HistoryVideo[]>("/latest", { params });

      return response.data;
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  }
}