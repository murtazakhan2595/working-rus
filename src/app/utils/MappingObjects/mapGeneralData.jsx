import moment from "moment";
import { eachDayOfInterval } from "date-fns";

export function mapCalendarContent({ holidays }) {
  const calendar_content = {};

  if (!Array.isArray(holidays)) return calendar_content;

  holidays.forEach(({ date, end_date, name }) => {
    if (!date || !moment(date).isValid()) return;

    const startDate = moment(date);
    const endDate = end_date && moment(end_date).isValid()
      ? moment(end_date)
      : startDate;

    try {
      const datesOfMonth = eachDayOfInterval({
        start: startDate.toDate(),
        end: endDate.toDate(),
      });

      datesOfMonth.forEach((thisDate) => {
        const key = moment(thisDate).format("YYYY-MM-DD");
        calendar_content[key] = `Holiday - ${name || "Unnamed"}`;
      });
    } catch (err) {
      console.warn("Invalid date range:", date, end_date);
    }
  });

  return calendar_content;
}

