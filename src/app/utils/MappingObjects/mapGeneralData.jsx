import moment from "moment";
import { eachDayOfInterval } from "date-fns";

export function mapCalendarContent({ holidays }) {
  const calendar_content = {};

  if (!Array.isArray(holidays)) return calendar_content;

  holidays.forEach(({ date, end_date, name }) => {
    if (!date || !moment(date).isValid()) return;

    const startDate = moment(date);
    const endDate =
      end_date && moment(end_date).isValid() ? moment(end_date) : startDate;

    try {
      const datesOfMonth = eachDayOfInterval({
        start: startDate.toDate(),
        end: endDate.toDate(),
      });

      datesOfMonth.forEach((thisDate) => {
        const key = moment(thisDate).format("YYYY-MM-DD");
        calendar_content[key] = {
          title: `Holiday - ${name || "Unnamed"}`,
          isHoliday: true,
        };
      });
    } catch (err) {
      console.warn("Invalid date range:", date, end_date);
    }
  });

  return calendar_content;
}

export function mapApproverDetails(approver_logs, approval_levels, data) {
  const level_list = approval_levels
    .map((level) => {
      const level_number = parseInt(level.level_number);
      const logs = approver_logs.find(
        (log) =>
          parseInt(log.level_number) === level_number &&
          log.action_type !== "CREATED"
      );
      const level_detail = {
        status: "PENDING",
        designation:
          level.designation_name || level.assignment_type.replace(/_/g, " "),
        level_number: level_number,
        time: null,
      };
      if (parseInt(level_number) === parseInt(data?.current_level)) {
        level_detail.approver = data?.current_approver;
      } else if (logs) {
        level_detail.status = logs.action_type;
        level_detail.approver = logs.changed_by;
        level_detail.time = logs.timestamp;
      }
      return level_detail;
    })
    .sort((a, b) => a.level_number - b.level_number); // Sort by level_number

  return level_list;
}
