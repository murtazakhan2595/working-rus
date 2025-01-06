import moment from "moment";

export function getDropdownList(list, label="name", value="id") {
  if (!list || list.length === 0) return [];
  const dropdownList = list.map((obj) => {
    return { label: obj[label], value: obj[value] };
  });
  return dropdownList
}

export function getEmployeeLeavesTypesList(LeaveTypes, employeeLeaveType) {
  if (
    employeeLeaveType &&
    employeeLeaveType.length > 0 &&
    LeaveTypes &&
    LeaveTypes.length > 0
  ) {
    const employeeLeaveTypeList = employeeLeaveType.map((item) => {
      const leaveType = LeaveTypes.find(
        (type) => type.value === item.leave_type
      );
      return {
        value: item.id,
        label: leaveType ? leaveType.label : "Unknown",
        leave_type_id: item.leave_type,
      };
    });
    return employeeLeaveTypeList;
  } else {
    return [];
  }
}
export function getLeavesTypeNameList(LeaveTypes) {
  const LeaveTypeNameList = LeaveTypes.map((leaveType) => {
    return leaveType ? leaveType.label : "Unknown";
  });
  return LeaveTypeNameList;
}
export function getEmployeeLeavesAgainsLeaveType(
  employeeLeavesType,
  LeaveTypes
) {
  // Ensure inputs are arrays
  if (!Array.isArray(employeeLeavesType) || !Array.isArray(LeaveTypes)) {
    return {};
  }

  // Initialize arrays for used, remaining, and total leaves
  const usedLeaves = [];
  const remainingLeaves = [];
  const totalLeaves = [];

  // Map through LeaveTypes to populate the arrays
  LeaveTypes.forEach((leaveType) => {
    const leaves = employeeLeavesType.find(
      (obj) => obj.leave_type === leaveType.value
    );

    // Push the values into respective arrays
    usedLeaves.push(leaves ? leaves.used_leave : 0);
    remainingLeaves.push(leaves ? leaves.left_leave : 0);
    totalLeaves.push(leaves ? leaves.total_alloted_leaves : 0);
  });

  // Return the results as an object
  return { usedLeaves, remainingLeaves, totalLeaves };
}

export const yearsDropdownList = (StartYear, EndYear) => {
  const years = [];
  for (let year = EndYear; year >= StartYear; year--) {
    years.push({ label: year, value: year });
  }
  return years;
};

export function getTaskFilteredData(tasksList, filterData) {
  if (filterData?.end_date) {
    if (filterData?.end_date === "overdue") {
      return tasksList.filter((task) =>
        moment(task.end_date).isBefore(moment(new Date()))
      );
    }
    if (filterData?.end_date === "nextday") {
      const nextDay = moment(new Date()).add(1, "days");
      return tasksList.filter(
        (task) => task.end_date === nextDay.format("YYYY-MM-DD")
      );
    } else {
      return tasksList.filter((task) => !task.end_date);
    }
  }
  if (filterData?.assigned_to) {
    if (filterData?.assigned_to === "noMember") {
      return tasksList.filter(
        (task) => task.assigned_to === filterData?.assigned_to
      );
    }
    if (filterData?.priority === "priority") {
      if (filterData?.priority === "noPriority") {
        return tasksList.filter((task) => !task.priority);
      }
      return tasksList.filter((task) => task.priority === filterData?.priority);
    }
    if (filterData?.assigned_to === "noMemberSelected") {
      return tasksList.filter(
        (task) => !task.noMemberSelected || task.noMemberSelected.length === 0
      );
    }
  }
  return tasksList;
}
