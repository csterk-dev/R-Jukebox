
type BugNote = {
  title: string;
  details: string;
}

export const bugList: BugNote[] = [
  {
    title: "Video scrubbing inaccuracy on longer videos",
    details: "When scrubbing video playback, there is a slight inaccuracy between the set value and the optimistic value. This only really becomes noticable on longer videos."
  },
  {
    title: "Client re-connection loses server state.",
    details: "Occasionally the connected browser's websocket connection will auto reconnect and lose access to the internal player's state, resulting in the socket connection throwing an error when it tries to access the player browser on the RPI. This is easily resolved by refreshing your page, establishing a new connection."
  }
]