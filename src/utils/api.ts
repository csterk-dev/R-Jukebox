import axios from "axios";
import { jsonpAdapter } from "@pingtou/axios-jsonp";
import { SERVER_URL } from "../constants";


const YOUTUBE_API_URL = `${SERVER_URL}/youtube`;

/** A YT undocumented API for auto suggest search queries */
const GOOGLE_AUTO_COMPLETE_URL = "https://clients1.google.com/complete/search";

const YOUTUBE_CLIENT = axios.create({
  baseURL: YOUTUBE_API_URL,
  headers: {
    "content-type": "application/json"
  },
  responseType: "json"
});


export const YoutubeAPI = {
  /**
   * Returns a list of video snippets that match the search query. 
   * 
   * @param query The search query.
   * @param limit Total number of results returned per page. Default `20`,
   * 
   * @remarks Quota cost = `100 credits`.
   */
  async searchVideos(query: string, limit?: number) {
    return await YOUTUBE_CLIENT.get(`/search?val=${query}&limit=${limit ?? 20}`);
  }
}


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