import { combineReducers } from "redux";
import userSlice from "./UserSlice";
import EmployeesTranferSlice from "./EmployeesTranferSlice";
import ModalSlice from "./ModalSlice";
import EmpSlice from "./EmpSlice";
import leaveManagementSlice from "./LeaveManagementSlice";
import GetDtrSlice from "./GetDtrSlice";
import GetDtrAllSlice from "./GetDtrAllSlice";
import PayrollSlice from "./PayrollSlice";
import UpdateDtrSlice from "./UpdateDtrSlice";
import HRDocumentsSlice from "./HRDocumentsSlice";
import AttendanceSlice from "./AttendanceSlice";
import CommonSlice from "./CommonSlice";
import taskManagmentSlice from "./TaskManagmentSlice";
import exitEmployeeSlice from "./ExitEmployeeSlice";

const rootReducer = combineReducers({
  user: userSlice,
  emp_tranfers: EmployeesTranferSlice,
  modal: ModalSlice,
  emp: EmpSlice,
  getDtr: GetDtrSlice,
  leave_management: leaveManagementSlice,
  getDtrAll: GetDtrAllSlice,
  payroll: PayrollSlice,
  updateDtr: UpdateDtrSlice,
  doc_category: HRDocumentsSlice,
  attendance: AttendanceSlice,
  common: CommonSlice,
  task_managment: taskManagmentSlice,
  exit_emp:exitEmployeeSlice,
});

export default rootReducer;
