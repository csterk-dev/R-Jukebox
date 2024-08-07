
const v1_1_0: ReleaseNote[] = [
  {
    details: "Added player history.",
    kind: "newFeature"
  },
  {
    details: "Current video title now shows in the page header.",
    kind: "newFeature"
  },
  {
    details: "Added 'What's new?' modal.",
    kind: "newFeature"
  },
  {
    details: "Optimised video card thumbnail size and quality.",
    kind: "improvement"
  },
  {
    details: "Adjusted the light mode background colour.",
    kind: "improvement"
  },
  {
    details: "Updated the default player volume.",
    kind: "improvement"
  }
];


const v1_1_1: ReleaseNote[] = [
  {
    details: "Jukebox will now remember whether you have disabled the background.",
    kind: "newFeature"
  },
  {
    details: "Player connection status now appears in the header when in desktop view.",
    kind: "newFeature"
  },
  {
    details: "Added previously missing release dates to v1.0.x releases.",
    kind: "improvement"
  },
  {
    details: "Opening the current video locally will now open to the current progress timestamp.",
    kind: "improvement"
  },
  {
    details: "Updated detection of playback errors.",
    kind: "improvement"
  },
  {
    details: "Fixed a vertical overflow issue with the background on mobile devices.",
    kind: "bugFix"
  },
  {
    details: "Fixed history dates displaying incorrectly.",
    kind: "bugFix"
  }
];


export const v1_1ReleaseNotes: ReleaseNotes = [
  {
    title: "Release 1.1.1",
    notes: v1_1_1,
    date: "08/08/2024"
  },
  {
    title: "Release 1.1.0",
    notes: v1_1_0,
    date: "01/08/2024"
  }
];