import moment from "moment";

export function renderTime(time, date = moment()) {
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
    const timeFormats = ["hh:mm A", "HH:mm", "HH:mm:ss", "hh:mm:ss A"];
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
