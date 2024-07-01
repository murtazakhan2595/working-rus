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
