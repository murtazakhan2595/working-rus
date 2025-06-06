import { getManagersList } from "app/hooks/general";
import { getManagerSelected } from "data/Data";
import { LeaveType } from "app/utils/Types/LeaveManagment";
import moment from "moment";

async function getLavefromEmployeeInfo(data) {
  const Managers = await getManagersList();
  const indirect_report_to = getManagerSelected(data.indirect_report, Managers);
  const leaveInfo = {
    employee_id: data?.id ?? "",
    name: `${data?.first_name} ${data.last_name}`,
    date: moment(new Date()).format("YYYY-MM-DD"),
    position: data?.department_position
      ? parseInt(data?.department_position)
      : "",
    department: data?.department_name ?? "",
    joining_date: data?.joining_date ?? "",
    nationality: data?.nationality ?? "",
    report_to: data?.direct_report ?? "",
    indirect_report_to: data?.indirect_report ? indirect_report_to : [],
    address_during_leave: data?.residential_address ?? "",
    contact_no: data?.mobile_no ?? "",
    country_code: data?.country_code ?? "",
    status_indirect_manager: data.indirect_report
      ? `${data.indirect_report}, Pending`
      : "Pending",
  };
  return leaveInfo;
}

export function mapLeaveTypeData(data) {
  const responseDataData = Object.keys(LeaveType).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    } else {
      // Use default values from LeaveType type
      acc[key] = LeaveType[key];
    }
    return acc;
  }, {});

  return responseDataData;
}

export async function mapLeaveTypeListData(data) {
  if (!data || data.length === 0) return [];
  const ResponseList = await data?.map((dataObj) => {
    const formattedData = mapLeaveTypeData(dataObj);
    return {
      label: formattedData.name,
      value: formattedData.id,
      ...formattedData,
    };
  });

  return ResponseList;
}

export { getLavefromEmployeeInfo };
