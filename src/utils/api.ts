import { YOUTUBE_API_KEY } from "../constants";
import axios from "axios";

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";


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
   * @param maxResults Total number of results returned per page. Default `20`,
   * 
   * @remarks Quota cost = `100 credits`.
   */
  async searchVideos(query: string, maxResults?: number) {
    return await YOUTUBE_CLIENT.get(`/search?key=${YOUTUBE_API_KEY}&q=${query}&type=video&part=snippet&maxResults=${maxResults ?? 20}`)
  },

  /**
   * Returns a the content details of the provided video Ids. 
   * @param videoIDs String array of video IDs
   * @remarks Quota cost = `1 credit.`
   */
  async getVideosContentDetails(videoIDs: string[]) {
    return await YOUTUBE_CLIENT.get(`/videos?key=${YOUTUBE_API_KEY}&part=contentDetails&id=${videoIDs.toString()}`)
  }
}