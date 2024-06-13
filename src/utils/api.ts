import axios from "axios";
import { SERVER_URL } from "../constants";


const YOUTUBE_API_URL = `${SERVER_URL}/youtube`;
const PLAYER_API_URL = `${SERVER_URL}/player`;


const YOUTUBE_CLIENT = axios.create({
  baseURL: YOUTUBE_API_URL,
  headers: {
    "content-type": "application/json"
  },
  responseType: "json"
});


const PLAYER_CLIENT = axios.create({
  baseURL: PLAYER_API_URL,
  headers: {
    "content-type": "application/json"
  },
  responseType: "json"
});


export const PlayerAPI = {
  /**
   * Dispatches a request to the API to play the provided videoId.
   * 
   * @param videoId Youtube video ID.
   * 
   * @remarks Will check if the videoId is already playing and attempt to pause.
   * Otherwise will open a new tab and close any previous youtube tabs in the browser.
   */
  async playVideo(videoId: string) {
    return await PLAYER_CLIENT.post("/play", { videoId });
  },

  /**
   * Dispatches a request to the API to pause the provided videoId.
   * 
   * @param videoId Youtube video ID.
   * 
   */
  async pauseVideo(videoId: string) {
    return await PLAYER_CLIENT.post("/pause", { videoId });
  }
}

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
    return await YOUTUBE_CLIENT.get(`/search?val=${query}&limit=${limit}`);
  }
}