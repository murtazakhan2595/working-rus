import { getManagersList } from "app/hooks/general";
import { getManagerSelected } from "data/Data";
import {
  LeaveType,
  PublicHoliday,
  Leave,
  LeaveOffsetSetting,
} from "app/utils/Types/LeaveManagment";
import moment from "moment";
import { calculateTotalCount } from "utils/renderValues";
import { calculateTotal } from "utils/renderValues";
import { renderDate } from "utils/renderValues";

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
      if (key === "branches") {
        const branches = data[key] || [];
        acc["branch_names"] = branches.map(({ branch_name }) => {
          return branch_name;
        });
        acc["branches"] = branches.map(({ id }) => {
          return id;
        });
      } else if (key === "departments") {
        const departments = data[key] || [];
        acc["department_names"] = departments.map(({ name }) => {
          return name;
        });
        acc["departments"] = departments.map(({ id }) => {
          return id;
        });
      } else if (key === "grades") {
        const grades = data[key] || [];
        acc["grades"] = grades.map((grade) => {
          return parseInt(grade);
        });
      } else acc[key] = data[key];
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

export function mapPublicHolidayPayloadeData(data) {
  const payload = {
    branches: [],
    country: [],
  };
  // Iterate over the keys in the PublicHoliday object
  for (const key in PublicHoliday) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== undefined &&
      data[key] !== null
    ) {
      // Add the key and its value to the payload
      if (key === "name") payload[key] = data[key]?.trim();
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapPublicHolidayData(data) {
  const responseData = Object.keys(PublicHoliday).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "branches") {
        const branches = data[key] || [];
        acc["branch_names"] = branches.map(({ branch_name }) => {
          return branch_name;
        });
        acc["branches"] = branches.map(({ id }) => {
          return id;
        });
      } else acc[key] = data[key];
    } else {
      acc[key] = PublicHoliday[key];
    }
    return acc;
  }, {});

  return responseData;
}

export async function mapPublicHolidayListData(data) {
  if (!data || data.length === 0) return [];
  const ResponseList = await data?.map((dataObj) => {
    const formattedData = mapPublicHolidayData(dataObj);
    return {
      label: formattedData.name,
      value: formattedData.id,
      ...formattedData,
    };
  });

  return ResponseList;
}

export function mapLeaveData(data) {
  const LeaveDetails = {};

  for (const key of Object.keys(Leave)) {
    if (key === "approval_details") {
      const approver_logs = data["approval_logs"] || [];
      const approval_levels = data["approval_levels"] || [];
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

      LeaveDetails[key] = level_list;
    } else {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (key === "status") {
          const status = data.is_cancelled ? "Cancelled" : data[key];
          LeaveDetails[key] = status;
        } else LeaveDetails[key] = data[key];
      }
    }
  }

  return LeaveDetails;
}

export async function mapLeaveListData(data) {
  if (!data || data.length === 0) return [];
  const ResponseList = await data?.map((dataObj) => {
    const formattedData = mapLeaveData(dataObj);
    return formattedData;
  });
  return ResponseList;
}

export function mapLeavePayloadData(data) {
  // Initialize an empty payload object
  const formData = new FormData();
  // Iterate over the keys in the Task object
  for (const key in Leave) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      if (key === "attachment") {
        if (data[key] instanceof File) formData.append(key, data[key]);
      } else formData.append(key, data[key]);
    }
  }

  // Return the constructed payload
  return formData;
}

export function mapLeaveOffsetSettingPayloadeData(data) {
  const payload = {
    nationalities: [],
    branches: [],
    grades: [],
    departments: [],
  };
  // Iterate over the keys in the PublicHoliday object
  for (const key in LeaveOffsetSetting) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== undefined &&
      data[key] !== null
    ) {
      // Add the key and its value to the payload
      // if (key === "name") payload[key] = data[key]?.trim();
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapOffsetLeaveSettingData(data) {
  const responseData = Object.keys(LeaveOffsetSetting).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      // if (key === "branches") {
      //   const branches = data[key] || [];
      //   acc["branch_names"] = branches.map(({ branch_name }) => {
      //     return branch_name;
      //   });
      //   acc["branches"] = branches.map(({ id }) => {
      //     return id;
      //   });
      // } else
      if (key === "grades") {
        const grades = data[key] || [];
        acc["grades"] = grades.map((grade) => {
          return parseInt(grade);
        });
      } else acc[key] = data[key];
    } else {
      acc[key] = LeaveOffsetSetting[key];
    }
    return acc;
  }, {});

  return responseData;
}

export async function mapOffsetLeaveSettingListData(data) {
  if (!data || data.length === 0) return [];
  const ResponseList = await data?.map((dataObj) => {
    const formattedData = mapOffsetLeaveSettingData(dataObj);
    return {
      label: formattedData.name,
      value: formattedData.id,
      ...formattedData,
    };
  });

  return ResponseList;
}
export async function mapOffsetLeavesData(data) {
  if (!data || data.length === 0) return {};
  const offsetLeaveData = {};
  const allotted_count = calculateTotal(data, "leaves");
  offsetLeaveData.allotted_count = allotted_count;
  const ResponseList = await data?.map((dataObj) => {
    offsetLeaveData.consumed_count = dataObj.offset_leaves_consumed;
    offsetLeaveData.balance_count =
      allotted_count - parseInt(dataObj.offset_leaves_consumed);
    return `${dataObj.leaves} leave alloted on ${renderDate(
      dataObj.created_at,
      "-"
    )} expires at ${renderDate(dataObj.expires_at, "-")}`;
  });
  offsetLeaveData.tooltip_info = ResponseList.join("\n");

  return offsetLeaveData;
}

export { getLavefromEmployeeInfo };
