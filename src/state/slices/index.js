import { combineReducers } from "redux";
import userSlice from "./UserSlice";
import EmployeesTranferSlice from "./EmployeesTranferSlice";
import ModalSlice from "./ModalSlice";
import EmpSlice from "./EmpSlice";
import leaveManagementSlice from "./LeaveManagementSlice";
import GetDtrSlice from "./GetDtrSlice";
import GetDtrAllSlice from "./GetDtrAllSlice";
import GetAssigneDtr from "./GetAssigneDtr";
import UpdateDtrSlice from "./UpdateDtrSlice";
import FilterSlice from "./FilterSlice";
import GetTeamDtrSlice from "./GetTeamDtrSlice";
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
  getAssigne: GetAssigneDtr,
  updateDtr: UpdateDtrSlice,
  filters: FilterSlice,
  teamDtr: GetTeamDtrSlice,
  common: CommonSlice,
  task_managment: taskManagmentSlice,
  exit_emp:exitEmployeeSlice,
});

export default rootReducer;
