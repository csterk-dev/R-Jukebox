type ReleaseNote = {
  details: string;
  kind: NoteType;
}
type NoteType = "improvement" | "bugFix" | "newFeature";


const v1_0_1: ReleaseNote[] = [
  {
    details: "Update the server URL with the correct production URL.",
    kind: "bugFix"
  }
]

const v1_0_2: ReleaseNote[] = [
  {
    details: "Fixed an issue where the optimistic current time counter started to increment while the video was still loading.",
    kind: "bugFix"
  },
  {
    details: "Update how release numbering is defined.",
    kind: "improvement"
  }
]

const v1_0_3: ReleaseNote[] = [
  {
    details: "Cleanup page header modals.",
    kind: "improvement"
  },
  {
    details: "Add additional tooltips and info notes to improve user experience.",
    kind: "improvement"
  },
  {
    details: "Add 'Release Notes' and 'Known Bugs' settings screens!",
    kind: "newFeature"
  },
  {
    details: "Fixed error messages to only return to the user who caused the error (previously the error message was sent to all connected users).",
    kind: "bugFix"
  },
  {
    details: "Fixed a crash caused by prematurely calling a method on an Element that is null when updating the player's volume",
    kind: "bugFix"
  }
]

const v1_0_4: ReleaseNote[] = [
  {
    details: "Add new 'refresh video' button to refresh the current video while maintaining its current progress time.",
    kind: "newFeature"
  }
]



export const v1ReleaseNotes = [
  {
    title: "Release 1.0.3",
    notes: v1_0_3
  },
  {
    title: "Release 1.0.2",
    notes: v1_0_2
  },
  {
    title: "Release 1.0.1",
    notes: v1_0_1
  }
]