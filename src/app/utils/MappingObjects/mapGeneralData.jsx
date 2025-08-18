import moment from "moment";
import { eachDayOfInterval } from "date-fns";
import { EmployeeDetailUI } from "components";

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

export async function mapApproverDetails({
  approval_logs = [],
  approval_levels = [],
  current_level,
  current_approver = [],
}) {
  const levelList = [];

  if (!Array.isArray(approval_levels) || approval_levels.length === 0) {
    return levelList;
  }

  for (const level of approval_levels) {
    const level_number = parseInt(level?.level_number);
    if (isNaN(level_number)) continue;

    const log = approval_logs.find(
      (entry) =>
        parseInt(entry?.level_number) === level_number &&
        entry?.action_type !== "CREATED"
    );
    const levelDetail = {
      status: "PENDING",
      info:
        level?.designation_name ||
        level?.assignment_type?.replace(/_/g, " ") ||
        "Unknown",
      level_number,
      time: null,
    };
    // If this is the current active level
    if (log) {
      levelDetail.status = log?.action_type || "UNKNOWN";
      levelDetail.info = log?.changed_by ? (
        <EmployeeDetailUI
          id={log?.changed_by}
          ViewVariant={"simple-text"}
          InformationKeys={["name", "position"]}
        />
      ) : (
        "Unknown"
      );
      levelDetail.time = log?.timestamp || null;
    } else if (parseInt(current_level) === level_number) {
      if (
        current_approver &&
        Array.isArray(current_approver) &&
        current_approver.length > 0
      ) {
        const approverInfos = await Promise.all(
          current_approver.map(async (approver, index) => {
            return (
              <span key={`approver-${approver}`}>
                <EmployeeDetailUI
                  id={approver}
                  ViewVariant={"simple-text"}
                  InformationKeys={["name"]}
                />
                {index < current_approver.length - 1 ? "/" : ""}
              </span>
            );
          })
        );
        const assignment_type = level.assignment_type.replace('_', ' ').toLowerCase();
        levelDetail.info = (
          <>
            {approverInfos} - {level?.designation_name || assignment_type}
          </>
        );
      } else {
        levelDetail.info = "Unknown - No eligible approver with the necessary permissions was found to perform this action.";
      }
    }

    levelList.push(levelDetail);
  }

  return levelList.sort((a, b) => a.level_number - b.level_number);
}
