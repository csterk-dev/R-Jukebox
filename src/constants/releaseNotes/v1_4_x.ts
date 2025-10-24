
const v1_4_0: ReleaseNote[] = [
  {
    details: "Added player information and error logs.",
    kind: "newFeature"
  },
  {
    details: "Player logs can be found within the settings.",
    kind: "newFeature"
  },
  {
    details: "Updated how user interactions where acknowledged by the server.",
    kind: "improvement"
  },
  {
    details: "Minor visual improvements to the settings.",
    kind: "improvement"
  },
  {
    details: "Fixed a mobile device issue where two scroll-bars would be present when content was scrollable.",
    kind: "bugFix"
  },
  {
    details: "Fixed an issue where adding a video to the top of the queue from the history tab would incorrectly insert it at the bottom.",
    kind: "bugFix"
  }
];

const v1_4_1: ReleaseNote[] = [
  {
    details: "Updated the play video handlers to improve loading feedback to the end user.",
    kind: "improvement"
  },
  {
    details: "Updated the server's routing functionality.",
    kind: "improvement"
  }
];

const v1_4_2: ReleaseNote[] = [
  {
    details: "Update Jukebox's theme.",
    kind: "improvement"
  },
  {
    details: "Unify component styles.",
    kind: "improvement"
  }
];


export const v1_4ReleaseNotes: ReleaseNotes = [
  {
    title: "Release 1.4.2",
    versionNum: "1.4.2",
    notes: v1_4_2,
    date: "24/06/2025"
  },
  {
    title: "Release 1.4.1",
    versionNum: "1.4.1",
    notes: v1_4_1,
    date: "26/05/2025"
  },
  {
    title: "Introducing player logs!",
    versionNum: "1.4.0",
    notes: v1_4_0,
    date: "11/04/2025"
  }
];