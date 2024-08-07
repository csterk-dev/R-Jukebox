
const v1_0_1: ReleaseNote[] = [
  {
    details: "Update the server URL with the correct production URL.",
    kind: "bugFix"
  }
];

const v1_0_2: ReleaseNote[] = [
  {
    details: "Update how release numbering is defined.",
    kind: "improvement"
  },
  {
    details: "Fixed an issue where the optimistic current time counter started to increment while the video was still loading.",
    kind: "bugFix"
  }
];

const v1_0_3: ReleaseNote[] = [
  {
    details: "Added 'Rewind to start' function to video controls.",
    kind: "newFeature"
  },
  {
    details: "Added the ability to toggle how the current video's 'published at' date is displayed (i.e. 'X ago' vs 'DD/MM/YYYY').",
    kind: "newFeature"
  },
  {
    details: "Added 'Release Notes' and 'Known Bugs' settings screens!",
    kind: "newFeature"
  },
  {
    details: "Updated error message logging to only return to the user who caused the error (previously the error message was sent to all connected users).",
    kind: "improvement"
  },
  {
    details: "Cleanup page header modals.",
    kind: "improvement"
  },
  {
    details: "Add additional tooltips and info notes to improve user experience.",
    kind: "improvement"
  },
  {
    details: "Fixed a crash caused by prematurely calling a method on an Element that is null when updating the player's volume.",
    kind: "bugFix"
  },
  {
    details: "Fixed a bug that caused video playback scrubbing to incorrectly update the player's current time.",
    kind: "bugFix"
  }
];

const v1_0_4: ReleaseNote[] = [
  {
    details: "Added a new static background for when background animations are disabled.",
    kind: "newFeature"
  },
  {
    details: "Minor UI cleanups and improvements.",
    kind: "improvement"
  },
  {
    details: "Fixed an issue where video published dates were incorrectly calculated resulting in a negative.",
    kind: "bugFix"
  },
  {
    details: "Fixed a bug where the current video would keep optimistically 'playing' after the iframe threw an error.",
    kind: "bugFix"
  }
];



export const v1_0ReleaseNotes: ReleaseNotes = [
  {
    title: "Release 1.0.4",
    notes: v1_0_4,
    date: "30/06/2024"
  },
  {
    title: "Release 1.0.3",
    notes: v1_0_3,
    date: "17/06/2024"
  },
  {
    title: "Release 1.0.2",
    notes: v1_0_2,
    date: "14/06/2024"
  },
  {
    title: "Release 1.0.1",
    notes: v1_0_1,
    date: "13/06/2024"
  }
];