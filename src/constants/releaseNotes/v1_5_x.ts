
const v1_5_0: ReleaseNote[] = [
  {
    details: "The player's history is now paginated and supports infinite scroll.",
    kind: "newFeature"
  },
  {
    details: "You can now scroll to the bottom of the history to load more results.",
    kind: "newFeature"
  },
  {
    details: "You can additionally search and sort the history.",
    kind: "newFeature"
  },
  {
    details: "Update the hierarchy of components to improve readability.",
    kind: "improvement"
  },
  {
    details: "Update debugging tools.",
    kind: "improvement"
  },
  {
    details: "Fix an issue where text styles were incorrectly referenced.",
    kind: "bugFix"
  }
];


const v1_5_1: ReleaseNote[] = [
  {
    details: "Searching is now paginated and supports infinite scroll.",
    kind: "newFeature"
  },
  {
    details: "You can now scroll to the bottom of the search to load more results.",
    kind: "newFeature"
  },
  {
    details: "Improve background animations and window focus detection.",
    kind: "improvement"
  }
];


export const v1_5ReleaseNotes: ReleaseNotes = [
  {
    title: "Search (infinitely) better!",
    versionNum: "1.5.1",
    notes: v1_5_1,
    date: "28/10/2025"
  },
  {
    title: "Infinite scroll is here!",
    versionNum: "1.5.0",
    notes: v1_5_0,
    date: "11/08/2025"
  }
];