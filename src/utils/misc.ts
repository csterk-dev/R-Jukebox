import dayjs from "dayjs";

/**
 * Parses video duration strings in ISO 8601 and converts them to the total number of seconds.
 * @link [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations)
 * @example 
 * ```typescript
 * 'PT1H8M41S' -> 4081
 * ```
 * @param {string} duration - Duration string.
 * @returns {number | undefined} The total number of seconds, 'Live' for live videos, or undefined if no duration is supplied.
 */
export function formatISO8601ToSeconds(duration?: string): number | string | undefined {
  if (!duration) return undefined;

  if (duration.toLowerCase() === "p0d") return "Live";


  const prefixTrimmed = duration.toLowerCase().slice(2);

  let hours = 0;
  let mins = 0;
  let seconds = 0;

  const hourIndex = prefixTrimmed.indexOf("h");
  if (hourIndex !== -1) {
    hours = parseInt(prefixTrimmed.slice(0, hourIndex), 10);
  }

  const minIndex = prefixTrimmed.indexOf("m");
  if (minIndex !== -1) {
    mins = parseInt(prefixTrimmed.slice(hourIndex + 1, minIndex), 10);
  }

  const secIndex = prefixTrimmed.indexOf("s");
  if (secIndex !== -1) {
    // Ensure that minutes are included, otherwise use hours index
    if (minIndex === -1) {
      seconds = parseInt(prefixTrimmed.slice(hourIndex + 1, secIndex), 10);
    } else {
      seconds = parseInt(prefixTrimmed.slice(minIndex + 1, secIndex), 10);
    }
  }

  // Convert hours, minutes, and seconds to total seconds
  const totalSeconds = (hours * 3600) + (mins * 60) + seconds;

  return totalSeconds;
}


/**
 * Parses the video published at date and converts them to a human readable representation.
 * @param date Video published date.
 * @returns The formatted date string, or undefined if no date is supplied.
 */
export function formatVideoPublishedDate(date?: string) {
  if (!date) return undefined;

  const noOfYears = dayjs().year() - dayjs(date).year();

  if (noOfYears >= 1) {
    return `${noOfYears} ${noOfYears === 1 ? "year" : "years"} ago`;
  }
  const noOfMonths = dayjs().month() - dayjs(date).month();
  if (noOfMonths >= 1) {
    return `${noOfMonths} ${noOfMonths === 1 ? "month" : "months"} ago`;
  }

  const noOfDays = dayjs(date).day() - dayjs().day();
  if (noOfDays === 0) {
    const noOfHours = dayjs().hour() - dayjs(date).hour();
    if (noOfHours < 1) {
      const noOfMins = dayjs().minute() - dayjs(date).minute();
      return `${noOfMins === 0 ? 1 : noOfMins} ${noOfMins === 1 ? "min" : "hours"} ago`;
    }
    return `${noOfHours === 0 ? 1 : noOfHours} ${noOfHours === 1 ? "hour" : "hours"} ago`;
  }
  return `${noOfDays} ${noOfDays === 1 ? "day" : "days"} ago`;
}


/**
 * Parses the supplied string and replaces any occurrences of HTML entities with their correct symbols.
 * @param str String to parse.
 * @returns The formatted string.
 */
export function replaceHtmlEntities(str?: string) {
  if (!str) return;

  // Define a mapping of HTML entities to their corresponding characters
  const entities: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&copy;": "©",
    "&reg;": "®"
  };

  // Use a regular expression to replace all occurrences of the entities
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&apos;|&nbsp;|&cent;|&pound;|&yen;|&euro;|&copy;|&reg;/g, (match) => {
    return entities[match] || match;
  });
}


/**
 * Converts a given number of seconds into a time string formatted as "MM:SS" or "HH:MM:SS".
 * 
 * @param {number} totalSeconds - The total number of seconds to convert.
 * @returns {string} - The formatted time string.
 */
export function formatSecondsToString(totalSeconds?: number): string {
  if (!totalSeconds) return "0:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const formattedSeconds = String(seconds).padStart(2, "0");

  return hours > 0 ?
    `${hours}:${formattedMinutes}:${formattedSeconds}` :
    `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Formats the provided video duration into a readable string representation.
 * @param duration The duration.
 * @returns Human readable duration.
 */
export function formatVideoDuration(duration?: number | string) {
  if (!duration) return undefined;

  // For 'live' cases
  if (typeof duration == "string") return duration;

  return formatSecondsToString(duration);
}