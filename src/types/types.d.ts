
/**
 * Video type used as the collated data structure from the various results.
 */
declare interface Video {
  channelId: string;
  channelTitle: string;
  duration: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  title: string;
  videoId: string;
}

/**
 * Structure of the thumbnail object within the Video item return.
 */
type Thumbnails = {
  default: {
    url: string,
    width: number,
    height: number
  },
  medium: {
    url: string
    width: number,
    height: number
  },
  high: {
    url: string,
    width: number,
    height: number
  }
}