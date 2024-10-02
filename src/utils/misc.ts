import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);


/**
 * Parses video duration strings in ISO 8601 and converts them to the total number of seconds.
 * @link [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations)
 * @example 
 * ```typescript
 * 'PT1H8M41S' -> 4081
 * ```
 * @param {string} duration - Duration string.
 * @returns {number | undefined} The total number of seconds, -1 for live videos, or undefined if no duration is supplied.
 */
export function ISO8601ToSeconds(duration?: string): number | undefined {
  if (!duration) return undefined;

  if (duration.toLowerCase() === "p0d") return -1;


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
export function videoPublishedDateToString(date?: string) {
  if (!date) return undefined;

  const noOfYears = dayjs().diff(date, "years");
  if (noOfYears >= 1) {
    return `${noOfYears} ${noOfYears === 1 ? "year" : "years"} ago`;
  }

  const noOfMonths = dayjs().diff(date, "months");
  if (noOfMonths >= 1) {
    return `${noOfMonths} ${noOfMonths === 1 ? "month" : "months"} ago`;
  }

  const noOfWeeks = dayjs().diff(date, "weeks");
  if (noOfWeeks >= 1) {
    return `${noOfWeeks} ${noOfWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const noOfDays = dayjs().diff(date, "days");
  if (noOfDays >= 1) {
    return `${noOfDays} ${noOfDays === 1 ? "day" : "days"} ago`;
  }

  const noOfHours = dayjs().diff(date, "hours");
  if (noOfHours >= 1) {
    return `${noOfHours === 0 ? 1 : noOfHours} ${noOfHours === 1 ? "hour" : "hours"} ago`;
  }

  const noOfMins = dayjs().diff(date, "minutes");
  return `${noOfMins === 0 ? 1 : noOfMins} ${noOfMins === 1 ? "min" : "hours"} ago`;
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
 * @param {number} totalSeconds - The total number of seconds to convert.
 * @returns {string} - The formatted time string.
 */
export function secondsToString(totalSeconds?: number): string {
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
export function videoDurationToString(duration?: number) {
  if (!duration) return undefined;

  // For 'live' cases
  if (duration == -1) return "Live";

  return secondsToString(duration);
}


/**
 * Formats the provided date string.
 * @param playedAt Date in which the video was played.
 * @param format Format of the string. Defaults to "DD/MM/YYYY".
 */
export function videoPlayedAtToString(playedAtDate?: string, format?: string) {
  if (!playedAtDate) return undefined;
  const today = dayjs();

  const playedAtObj = dayjs(playedAtDate, format ?? "DD/MM/YYYY");

  if (today.isSame(playedAtObj, "days")) return "Today";
  if (today.diff(playedAtObj, "days") == 1) return "Yesterday";
  if (today.diff(playedAtObj, "days") <= 5) return playedAtObj.format("dddd");
  if (today.diff(playedAtObj, "days") > 5) return playedAtObj.format("ddd DD/MM/YYYY");
  return playedAtDate;
}


/** Returns the correct season for the current month of given date. */
export function getThemeSeason(date: Dayjs) {
  if (dayjs(date).isSame("2024-10-01", "month")) return "halloween";
  if (dayjs(date).isSame("2024-12-01", "month")) return "christmas";
  return "none";
}