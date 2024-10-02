
/** Video type used as the collated data structure from the various results. */
interface Video {
  channelId: string;
  channelTitle: string;
  duration: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  title: string;
  videoId: string;
}

/** Structure of the thumbnail object within the Video item return. */
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


interface HistoryVideo extends Video {
  playedAt: string;
  playedDate: string;
}


type ReleaseNote = {
  details: string;
  kind: NoteType;
}
type NoteType = "improvement" | "bugFix" | "newFeature";


type ReleaseNotes = {
  title: string;
  notes: ReleaseNote[];
  date?: string;
}[];