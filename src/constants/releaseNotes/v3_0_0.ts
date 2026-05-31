export const v3_0_0: ReleaseNoteEntry[] = [
  {
    details: "Restore play, pause, seek and volume after YouTube updated their embedded player.",
    kind: "bugFix"
  },
  {
    details: "Player control now uses the YouTube IFrame Player API bridge for more reliable playback.",
    kind: "improvement"
  },
  {
    details: "Show a buffering spinner over the video thumbnail when YouTube is loading more data (e.g. after seeking or on slow connections).",
    kind: "newFeature"
  },
  {
    details: "Fix progress timestamps occasionally showing decimal seconds.",
    kind: "bugFix"
  },
  {
    details: "Improve video end detection and automatic queue progression.",
    kind: "improvement"
  }
];
