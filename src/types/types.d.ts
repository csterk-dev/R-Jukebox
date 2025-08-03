
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
  /** Title is shown within the New Update Modal. */
  title: string;
  versionNum: string;
  notes: ReleaseNote[];
  date: string;
}[];


 type ThemeSeason = "halloween" | "christmas" | "none";



 type BaseRequest = {
  clientId: string;
}


type VideoRequest = BaseRequest & {
  video: Video;
}


type PlayPauseRequest = BaseRequest & {
  isPlaying: boolean;
}


type UpdatePlayerVolumeRequest = BaseRequest & {
  volumeLevel: number;
}


type UpdatePlayerTimestampRequest = BaseRequest & {
  timestamp: number;
}


type RemoveQueueItemRequest = BaseRequest & {
  videoId: Video["videoId"]
}


type WSAcknowledgement = {
  success: boolean;
  errorMessage?: string;
}

 type InfoAcknowledgment = {
  title: string;
  description?: string;
 }


type EntryLog = {
  id: number;
  dateTime: string;
  type: "error" | "info";
  /** Name of the function that called and caught the error. Useful for nested util functions. */
  callingFunction: string;
  /** Stack trace or error message. */
  stackTrace: string | null;
}


/** Generic Select Option type for react-select options. */
type SelectOption<T extends string | number | null = string> =
  {
    label: string;
    value: T
  }