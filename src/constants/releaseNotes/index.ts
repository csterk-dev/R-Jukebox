import { v1_0_1, v1_0_2, v1_0_3, v1_0_4 } from "./v1_0_x";
import { v1_1_0, v1_1_1 } from "./v1_1_x";
import { v1_2_0, v1_2_1, v1_2_2 } from "./v1_2_x";
import { v1_3_0, v1_3_1 } from "./v1_3_x";
import { v1_4_0, v1_4_1, v1_4_2 } from "./v1_4_x";
import { v1_5_0, v1_5_1, v1_5_2 } from "./v1_5_x";
import { v2_0_0 } from "./v2_0_0";


const VERSION_GROUP_DEFINITIONS = [
  {
    groupTitle: "Vite & Chakra 3",
    versionNumGroup: "2.0"
  },
  {
    groupTitle: "Infinite Scroll",
    versionNumGroup: "1.5"
  },
  {
    groupTitle: "Player Logs",
    versionNumGroup: "1.4"
  },
  {
    groupTitle: "Auto Complete",
    versionNumGroup: "1.3"
  },
  {
    groupTitle: "Queue",
    versionNumGroup: "1.2"
  },
  {
    groupTitle: "History",
    versionNumGroup: "1.1"
  },
  {
    groupTitle: "Launch",
    versionNumGroup: "1.0"
  }
] as const;


export const ALL_RELEASE_NOTES: ReleaseNotes = [
  {
    title: "Goodbye CRA... Hello Vite & Chakra 3",
    versionNum: "2.0.0",
    notes: v2_0_0,
    date: "12/01/2025"
  },
  {
    title: "Release 1.5.2",
    versionNum: "1.5.2",
    notes: v1_5_2,
    date: "03/11/2025"
  },
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
  },
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
  },
  {
    title: "Welcome to 2025!",
    versionNum: "1.3.1",
    notes: v1_3_1,
    date: "17/01/2025"
  },
  {
    title: "Introducing auto complete!",
    versionNum: "1.3.0",
    notes: v1_3_0,
    date: "21/11/2024"
  },
  {
    title: "Welcome to v1.2.2!",
    versionNum: "1.2.2",
    notes: v1_2_2,
    date: "2/11/2024"
  },
  {
    title: "Release 1.2.1",
    versionNum: "1.2.1",
    notes: v1_2_1,
    date: "1/10/2024"
  },
  {
    title: "Release 1.2.0",
    versionNum: "1.2.0",
    notes: v1_2_0,
    date: "12/09/2024"
  },
  {
    title: "Release 1.1.1",
    versionNum: "1.1.1",
    notes: v1_1_1,
    date: "08/08/2024"
  },
  {
    title: "Release 1.1.0",
    versionNum: "1.1.0",
    notes: v1_1_0,
    date: "01/08/2024"
  },
  {
    title: "Release 1.0.4",
    versionNum: "1.0.4",
    notes: v1_0_4,
    date: "30/06/2024"
  },
  {
    title: "Release 1.0.3",
    versionNum: "1.0.3",
    notes: v1_0_3,
    date: "17/06/2024"
  },
  {
    title: "Release 1.0.2",
    versionNum: "1.0.2",
    notes: v1_0_2,
    date: "14/06/2024"
  },
  {
    title: "Release 1.0.1",
    versionNum: "1.0.1",
    notes: v1_0_1,
    date: "13/06/2024"
  }
]


const groupedNotesByVersion = ALL_RELEASE_NOTES.reduce((acc, note) => {
  // Extract major.minor version prefix (e.g., "1.5" from "1.5.1")
  const versionPrefix = note.versionNum.split(".")
    .slice(0, 2)
    .join(".");
  
  if (!acc.has(versionPrefix)) {
    acc.set(versionPrefix, []);
  }
  
  acc.get(versionPrefix)!.push(note);
  return acc;
}, new Map<string, ReleaseNotes>());


export const RELEASE_NOTES_GROUP_TITLES: ReleaseNotesGroupTitles = VERSION_GROUP_DEFINITIONS.map(({ groupTitle, versionNumGroup }) => ({
  groupTitle,
  versionNumGroup: versionNumGroup as `${number}.${number}`,
  groupedNotes: groupedNotesByVersion.get(versionNumGroup) ?? []
}));