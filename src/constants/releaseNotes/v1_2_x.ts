
const v1_2_0: ReleaseNote[] = [
  {
    details: "Added player queue functionality.",
    kind: "newFeature"
  },
  {
    details: "Videos can now be added to the top or bottom of the queue.",
    kind: "newFeature"
  },
  {
    details: "When the current video ends, the next item in the queue will autoplay.",
    kind: "newFeature"
  },
  {
    details: "Updated handling of frame errors.",
    kind: "improvement"
  },
  {
    details: "Minor UI style improvements.",
    kind: "improvement"
  }
];

const v1_2_1: ReleaseNote[] = [
  {
    details: "Happy Halloween! Jukebox now has a fresh coat of paint for the spooky season.",
    kind: "newFeature"
  },
  {
    details: "Added RPI 5 compatibility.",
    kind: "newFeature"
  },
  {
    details: "Fixed a few style issues with modals.",
    kind: "bugFix"
  }
];


export const v1_2ReleaseNotes: ReleaseNotes = [
  {
    title: "Release 1.2.1",
    notes: v1_2_1,
    date: "1/10/2024"
  },
  {
    title: "Release 1.2.0",
    notes: v1_2_0,
    date: "12/09/2024"
  }
];