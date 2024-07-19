export function getEmployeeLeavesTypesList(LeaveTypes, employeeLeaveType) {
  const employeeLeaveTypeList = employeeLeaveType.map((item) => {
    const leaveType = LeaveTypes.find((type) => type.value === item.leave_type);
    return {
      value: item.id,
      label: leaveType ? leaveType.label : "Unknown",
    };
  });
  return employeeLeaveTypeList;
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

