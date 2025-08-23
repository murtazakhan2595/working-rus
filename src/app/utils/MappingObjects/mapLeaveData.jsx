import {
  LeaveType,
  PublicHoliday,
  Leave,
  LeaveOffsetSetting,
  SpecialLeaves
} from "app/utils/Types/LeaveManagment";
import { calculateTotalCount } from "utils/renderValues";
import { calculateTotal } from "utils/renderValues";
import { renderDate } from "utils/renderValues";
import { mapApproverDetails } from "app/utils/MappingObjects/mapGeneralData";

export function mapLeaveTypeData(data) {
  const responseDataData = Object.keys(LeaveType).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "branches") {
        const branches = data[key] || [];
        acc["branch_names"] = branches.map(({ branch_name }) => {
          return branch_name;
        });
        acc["branches_ids"] = branches.map(({ id }) => {
          return id;
        });
      } else if (key === "departments") {
        const departments = data[key] || [];
        acc["department_names"] = departments.map(({ name }) => {
          return name;
        });
        acc["departments_ids"] = departments.map(({ id }) => {
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

export async function mapLeaveData(data, fetchApprovalDetails = true) {
  const LeaveDetails = {};

  for (const key of Object.keys(Leave)) {
    if (key === "approval_details" && fetchApprovalDetails) {
      LeaveDetails[key] = await mapApproverDetails({ ...data, });
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

export async function mapLeaveStatsData(data) {
  if (!data || data.length === 0)
    return { Pending: 0, Approved: 0, Rejected: 0, Cancelled: 0, Total: 0 };
  const Pending = calculateTotalCount(data, "status", "pending");
  const Total = data.length || 0;
  const Approved = calculateTotalCount(data, "status", "approved");
  const Rejected = calculateTotalCount(data, "status", "rejected");
  const Cancelled = calculateTotalCount(
    data,
    "status",
    "cancelled_by_employee"
  );
  return { Pending, Approved, Rejected, Cancelled, Total };
}

export async function mapLeaveListData(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  try {
    const responseList = await Promise.all(
      data.map(async (dataObj) => {
        return await mapLeaveData(dataObj, false);
      })
    );
    return responseList;
  } catch (error) {
    console.error("Error in mapLeaveListData:", error);
    return [];
  }
}

export function mapLeavePayloadData(data) {
  // Initialize an empty payload object
  const formData = new FormData();
  // Iterate over the keys in the Task object
  for (const key in Leave) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key)) {
      // Add the key and its value to the payload
      if (data[key] !== null && data[key] !== undefined) {
        if (key === "attachment") {
          if (data[key] instanceof File) formData.append(key, data[key]);
        } else formData.append(key, data[key]);
      }
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


export function mapSpecialLeavePayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in SpecialLeaves) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key)) {
      // Add the key and its value to the payload
      if (data[key] !== null && data[key] !== undefined) {
        if (key === "name") {
          payload[key] = data[key].trim()
        } else payload[key] = data[key]
      }
    }
  }
  return payload
}

export function mapSpecialLeaveData(data) {
  const responseDataData = Object.keys(SpecialLeaves).reduce((acc, key) => {
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

export async function mapSpecialLeavesListData(data) {
  if (!data || data.length === 0) return [];
  const ResponseList = await data?.map((dataObj) => {
    const formattedData = mapSpecialLeaveData(dataObj);
    return { ...formattedData };
  });

  return ResponseList;
}

export async function mapEmpSpecialLeaveType(data = []) {
  if (!data || data.length === 0) return {};
  const LeaveData = {};
  let allotted_count = 0;
  let consumed_count = 0;
  let balance_count = 0;
  let expired_count = 0;
  const ResponseList = data?.map((dataObj) => {
    allotted_count = allotted_count + dataObj.total_allotted_leave || 0;
    consumed_count = consumed_count + dataObj.consumed_count || 0;
    balance_count = balance_count + dataObj.balance || 0;
    return <div>{dataObj.total_allotted_leave} leave alloted starting from {renderDate(dataObj.start_date)} till {renderDate(dataObj.end_date)}</div>;
  });
  LeaveData.tooltip_info = ResponseList;

  return { ...LeaveData, allotted_count, balance_count };
}
