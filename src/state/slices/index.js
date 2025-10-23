import { combineReducers } from "redux";
import userSlice from "./UserSlice";
import EmployeesTranferSlice from "./EmployeesTranferSlice";
import ModalSlice from "./ModalSlice";
import EmpSlice from "./EmpSlice";
import leaveManagementSlice from "./LeaveManagementSlice";
import GetDtrSlice from "./GetDtrSlice";
import RolePermissionSlice from "./RolePermissionSlice";
import PayrollSlice from "./PayrollSlice";
import UpdateDtrSlice from "./UpdateDtrSlice";
import HRDocumentsSlice from "./HRDocumentsSlice";
import AttendanceSlice from "./AttendanceSlice";
import CommonSlice from "./CommonSlice";
import taskManagmentSlice from "./TaskManagmentSlice";
import exitEmployeeSlice from "./ExitEmployeeSlice";
import ScreenedInterview from "./ScreenedInterview";
import globalPayrollSlice from "./GlobalPayrollSlice";

const rootReducer = combineReducers({
  user: userSlice,
  emp_tranfers: EmployeesTranferSlice,
  modal: ModalSlice,
  emp: EmpSlice,
  getDtr: GetDtrSlice,
  leave_management: leaveManagementSlice,
  roles_permissions: RolePermissionSlice,
  payroll: PayrollSlice,
  updateDtr: UpdateDtrSlice,
  doc_category: HRDocumentsSlice,
  attendance: AttendanceSlice,
  common: CommonSlice,
  task_managment: taskManagmentSlice,
  exit_emp:exitEmployeeSlice,
  interview : ScreenedInterview,
  globalPayroll: globalPayrollSlice,
});

export default rootReducer;
