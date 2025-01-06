import { LogTime } from "app/utils/Types/DTR";
export function mapLogTimeData(data) {
  const logTime = LogTime;
  logTime.consumed_time = data.consumed_time ?? "";
  logTime.notes = data.notes ?? "";
  logTime.task_id = data.task_id ?? "";
  logTime.attachment = data.attachment ?? "";
  logTime.id = data.id ?? null;
  logTime.employee_id = data.employee_id ?? null;
  return logTime;
}
