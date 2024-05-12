import dayjs from "dayjs";

/**
 * Parses video duration strings in ISO 8601 and converts them to a human readable representation.
 * @link [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations)
 * @example 
 * ```typescript
 * 'PT1H8M41S' -> '1:08:01'
 * ```
 * @param duration Duration string.
 * @returns The formatted duration string, 'Live' for live videos, or undefined if no duration is supplied.
 */
export function formatVideoDuration(duration?: string) {
  if (!duration) return undefined;

  if (duration.toLowerCase() === "p0d") return "Live";


  const prefixTrimmed = duration.toLowerCase().slice(2);

  let hours = "";
  let mins = "";
  let seconds = "";

  const hourIndex = prefixTrimmed.indexOf("h");
  if (hourIndex !== -1) {
    hours = prefixTrimmed.slice(0, hourIndex);
    hours = `${hours}:`;
  }

  const minIndex = prefixTrimmed.indexOf("m");
  if (minIndex !== -1) {
    mins = prefixTrimmed.slice(hourIndex + 1, minIndex);
    if (mins.length === 1) {
      mins = `0${mins}`
    }
    mins = `${mins}:`;
  }

  const secIndex = prefixTrimmed.indexOf("s");
  if (secIndex !== -1) {
    // Ensure that minutes are included, otherwise use hours index
    if (minIndex === -1) {
      seconds = prefixTrimmed.slice(hourIndex + 1, secIndex);
    } else {
      seconds = prefixTrimmed.slice(minIndex + 1, secIndex);
    }
    if (seconds.length === 1) {
      seconds = `0${seconds}`
    }
  }
  // If there are no minutes, they are ommited from the incoming duration, thus manually provide a fallback to match the official youtube duration formatting of '1:08:01'.
  return `${hours}${minIndex === -1 ? "00:" : mins}${seconds ?? ""}`;
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
 * Parses the supplied string and replaces any occurances of '&amp' with with correct & symbol.
 * @param str String to parse.
 * @returns The formatted string.
 */
export function replaceAmps(str?: string) {
  if (!str) return;
  return str.replace(/&amp;/g, "&");
}