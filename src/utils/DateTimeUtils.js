import moment from "moment";

export function renderTime(time, date = moment()) {
  let baseDate = moment(date, ["YYYY-MM-DD", "YYYY/MM/DD"], true);
  
  // Fallback to current date if invalid
  if (!baseDate.isValid()) {
    console.warn("Invalid date input. Falling back to current date.");
    baseDate = moment();
  }

  // Format base date
  const formattedDate = baseDate.format("YYYY-MM-DD");

  // Handle different time formats
  const timeFormats = ["HH:mm", "hh:mm A", "HH:mm:ss", "hh:mm:ss A"];
  let TimeMoment = moment(time, timeFormats, true);

  if (!TimeMoment.isValid()) {
    console.error("Invalid time format:", time);
    return null;
  }

  const formattedTime = TimeMoment.format("HH:mm:ss");

  // Combine date and time into ISO UTC string
  const combined = moment(`${formattedDate}T${formattedTime}`);
  const responseTime = combined.utc().toISOString();

  return responseTime;
}


/**
 * Calculates and formats the duration between two dates into a readable string.
 * @param {moment.Moment | string | Date} startDate - The start date.
 * @param {moment.Moment | string | Date} endDate - The end date.
 * @returns {string} A human-readable duration string (e.g., "1 Year and 2 Months").
 */
export function formatDaysDuration(startDate, endDate) {
  // Convert inputs to moment objects if they aren't already
  const start = moment(startDate);
  const end = moment(endDate);

  // Validate dates
  if (!start.isValid() || !end.isValid()) {
    return "Invalid date(s)";
  }

  // Ensure start date is not after end date
  if (start.isAfter(end)) {
    return "Start date cannot be after end date";
  }

  const duration = moment.duration(end.diff(start));
  const years = duration.years();
  const months = duration.months();
  const days = duration.days();

  // Construct the readable string
  const parts = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "Year" : "Years"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "Month" : "Months"}`);
  }

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? "Day" : "Days"}`);
  }

  return parts.length > 0 ? parts.join(" and ") : "Same day (0 days)";
}
