import { getManagersList } from "app/hooks/general";
import { getManagerSelected } from "data/Data";

async function getLavefromEmployeeInfo(data) {
  const Managers = await getManagersList();
  const leaveInfo = {
    employee_id: data?.id ?? "",
    name: `${data?.first_name} ${data.last_name}`,
    date: data?.joining_date ?? "",
    position: data?.department_position ?? "",
    department: data?.department_name ?? "",
    joining_date: data?.joining_date ?? "",
    nationality: data?.nic ?? "",
    report_to: data?.indirect_report
      ? getManagerSelected(data.indirect_report, Managers)
      : "",
    address_during_leave: "",
  };
  return leaveInfo;
}

export { getLavefromEmployeeInfo };
