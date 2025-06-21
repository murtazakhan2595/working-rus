import { EmployeeExit } from "app/utils/Types/EmployeeExit";

export async function mapEmployeeExitData(data) {
  const ResponseData = {};
  for (const key of Object.keys(EmployeeExit)) {
    if (key === "approval_details") {
      const approver_logs = data["approval_logs"] || [];
      const approval_levels = data["approval_levels"] || [];
      const level_list = approval_levels
        .map((level) => {
          const level_number = parseInt(level.level_number);
          const logs = approver_logs.find(
            (log) => parseInt(log.level_number) === level_number
          );
          const level_detail = {
            status: "PENDING",
            designation: level.designation,
            level_number: level_number,
            time: null,
          };
          if (level_number === parseInt(data.current_level)) {
            level_detail.approver = data.current_approver;
          } else if (logs) {
            level_detail.status = logs.action_type;
            level_detail.approver = logs.changed_by;
            level_detail.time = logs.timestamp;
          }
          return level_detail;
        })
        .sort((a, b) => a.level_number - b.level_number); // Sort by level_number

      ResponseData[key] = level_list;
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key))
        ResponseData[key] = data[key];
    }
  }

  return ResponseData;
}


