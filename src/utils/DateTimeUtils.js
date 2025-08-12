import moment from "moment";

export function renderTime(time, date = moment()) {
  if (!time) return null;
  // Ensure date is a valid moment object
  const baseDate = moment(date);
  if (!baseDate.isValid()) {
    console.error("Invalid date input");
    return null;
  }
  // Format base date
  const formattedDate = baseDate.format("YYYY-MM-DD");
  const TimeMoment = moment(time);
  if (!TimeMoment || !TimeMoment.isValid()) {
    const timeFormats = ["hh:mm A", "HH:mm", "HH:mm:ss", "hh:mm:ss A", 'h:mm'];
    if (time.charAt(0) === '0' && time.charAt(1) === ':') time = '0' + time;
    const formattedTime = moment(time, timeFormats, true).format("HH:mm:ss");

    const responseTime = moment(`${formattedDate}T${formattedTime}`)
      .utc()
      .toISOString();
    return responseTime;
  }

  const formattedTime = TimeMoment.format("HH:mm:ss");
  // Combine date and time in UTC
  const responseTime = moment(`${formattedDate}T${formattedTime}`)
    .utc()
    .toISOString();
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
