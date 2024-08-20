import { combineReducers } from 'redux';
import userSlice from './UserSlice';
import dropdownSlice from './DropdownSlice';
import ModalSlice from './ModalSlice';
import EmpSlice from './EmpSlice';
import GetDtrSlice from './GetDtrSlice';
import GetDtrAllSlice from './GetDtrAllSlice';
import GetAssigneDtr from './GetAssigneDtr';
import UpdateDtrSlice from './UpdateDtrSlice';
import FilterSlice from './FilterSlice';
import GetTeamDtrSlice from './GetTeamDtrSlice';
import CommonSlice from './CommonSlice'

const rootReducer = combineReducers({
  user: userSlice,
  dropdown: dropdownSlice,
  modal: ModalSlice,
  emp: EmpSlice,
  getDtr: GetDtrSlice,
  getDtrAll: GetDtrAllSlice,
  getAssigne: GetAssigneDtr,
  updateDtr: UpdateDtrSlice,
  filters: FilterSlice,
  teamDtr: GetTeamDtrSlice,
  common: CommonSlice,
});

export default rootReducer;
