const { getShiftById } = require("app/hooks/attendance");
const { getShiftSchedule } = require("app/hooks/shiftManagement");

const getEmployeeActiveShift = async (employeeId, shiftId) => {
  const scheduleResponse = await getShiftSchedule({
    filterData: {
      employee: employeeId,
      status: "Approved",
      date: new Date().toISOString().split("T")[0],
    },
    ordering: "-id",
  });
  if (scheduleResponse && scheduleResponse.count > 0) {
    return scheduleResponse.results[0];
  }
  const directShiftInfo = await getShiftById(shiftId);
  if (directShiftInfo && directShiftInfo.id) {
    return directShiftInfo;
  }
  return null;
};



export { getEmployeeActiveShift };